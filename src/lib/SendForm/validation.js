// 验证发送串和回复串的字段
import { MAX_UPLOAD_IMAGE_COUNT, MAX_SINGLE_IMAGE_SIZE } from '$env/static/private';
import { generatePlaceholder } from "$lib/utils.js";

// 验证cookie字段
const validCookies = async ({ dbconn, cookies, authUsername }) => {
	// 验证 cookies
	const cookie_query = {
		text: `SELECT id, belong_user_id, status FROM cookies WHERE content = $1 LIMIT 1`,
		values: [cookies]
	};

	const cookies_result = await dbconn.query(cookie_query);

	/**
     * 没有对应的Cookies
    {
        "type": "error",
        "errorCode": "WRONG_COOKIES",
        "extra": "c n e"
    }
     */
	if (cookies_result.rowCount == 0) {
		return {
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: 'c n e' // cookies not exist
		};
	}

	/**
	 * cookie状态不为enable
	 */
	if (cookies_result.rows[0].status != 'enable') {
		return {
			type: 'error',
			errorCode: 'COOKIE_NOT_ENABLE'
		};
	}

	const belong_user_id = cookies_result.rows[0].belong_user_id;
	const poster_cookies_id = cookies_result.rows[0].id;

	const user_query = {
		text: `SELECT status, username FROM "user" WHERE id = $1 LIMIT 1`,
		values: [belong_user_id]
	};

	const user_result = await dbconn.query(user_query);

	/**
     * Cookies对应的用户名不存在
    {
        "type": "error",
        "errorCode": "WRONG_COOKIES",
        "extra": "u n e"
    } 
     */
	if (user_result.rowCount == 0) {
		return {
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: 'u n e' // user not exist
		};
	}

	const { status, username } = user_result.rows[0];

	/**
     * 用户未激活
    {
        "type": "error",
        "errorCode": "USER_NOT_ENABLE"
    }  
     */
	if (status != 'enable') {
		return {
			type: 'error',
			errorCode: 'USER_NOT_ENABLE'
		};
	}

	/**
     * 用户和Authoritarian字段解析出的不匹配
    {
        "type": "error",
        "errorCode": "USER_NOT_ENABLE"
    }  
     */
	if (username != authUsername) {
		return {
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: 'u c m' // user cookies mismatch
		};
	}

	return {
		type: 'ok',
		poster_cookies_id
	};
};

// 验证图片是否存在
const validateImages = async ({ dbconn, imageNames = [] }) => {
	// 没有就不验证
	if (imageNames.length == 0) {
		return {
			type: 'ok'
		};
	}
	/*
    // 超出了最大图片上传数
    {
        type: "error",
        errorCode: "BEYOND_MAX_UPLAD_IMAGE_COUNT"
    }
    */
	if (imageNames.length > MAX_UPLOAD_IMAGE_COUNT) {
		return {
			type: 'error',
			errorCode: 'BEYOND_MAX_UPLAD_IMAGE_COUNT'
		};
	}

  const placeholder = generatePlaceholder(1, imageNames.length)

  const query = {
    text: `SELECT
      COUNT(*) AS count
    FROM
      post_comment_image
    WHERE
      id IN (${placeholder})
    `,
    values: imageNames
  }

  const result = await dbconn.query(query)
  if (result.rows[0].count != imageNames.length) {
    return {
      type: 'error',
      errorCode: 'INVALID_IMAGE_NAMES'
    }
  }

	return {
		type: 'ok'
	};
};

export { validCookies, validateImages };
