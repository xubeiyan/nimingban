import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth.js';

import { validCookies, validateImages } from '$lib/SendForm/validation.js';
import { uploadImages } from '$lib/SendForm/uploadImage.js';
import { nullStringToEmpty } from '$lib/SendForm/string.js';
import { generatePlaceholder } from '$lib/utils.js';

import { CONTENT_MIN_LENGTH } from '$env/static/private';

export const POST = async ({ locals, params, request }) => {
	const { dbconn } = locals;
	const { secret: jwt } = await getJWTSecretDB(dbconn);
	const authRes = JWTAuth(request, jwt);
	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	const postId = params.post_id ?? 'invalid';
	if (postId == 'invalid') {
		return json({
			type: 'error',
			errorCode: 'INVAILD_POST_ID',
			extra: 'n p i'
		});
	}

  const jsonData = await request.json();
  // 获取 发帖用户名，邮件，标题，内容，饼干，图片的名称, 回复的评论的内容
	let { name, email, title, content, cookies, imageNames = [], commentReplyContent } = jsonData;

	/* 
	// 未提供cookies字段
    {
        "type": "error",
        "errorCode": "WRONG_COOKIES",
        "extra": null
    }
	*/
	if (cookies == null) {
		return json({
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: null
		});
	}

	// 验证cookie
	const cookies_result = await validCookies({ dbconn, cookies, authUsername: authRes.username });

	if (cookies_result.type == 'error') {
		return json(cookies_result);
	}

	const { poster_cookies_id } = cookies_result;

	// 验证图片
	const image_validate_result = await validateImages({ dbconn, imageNames });

	if (image_validate_result.type == 'error') {
		return json(image_validate_result);
	}

	/*
    // 正文内容太少
    {
        type: "error",
        errorCode: "CONTENT_LENGTH_TOO_SHORT"
    }
    */
	if (content == null || content.length < CONTENT_MIN_LENGTH) {
		return json({
			type: 'error',
			errorCode: 'CONTENT_LENGTH_TOO_SHORT'
		});
	}

	// 查找post表中的记录
	const postSearchQuery = {
		text: `SELECT status FROM post WHERE id = $1 LIMIT 1`,
		values: [postId]
	};

	const postSearchResult = await dbconn.query(postSearchQuery);

	// 不存在对应post
	if (postSearchResult.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'POST_ID_INVALID'
		});
	}

	// post的状态不是可回复
	if (postSearchResult.rows[0].status != 'repliable') {
		return json({
			type: 'error',
			errorCode: 'POST_NOT_REPLIABLE'
		});
	}

	// 更新post的回复时间
	const postUpdateQuery = {
		text: `UPDATE post SET 
			last_reply_timestamp = now()
		 	WHERE id = $1`,
		values: [postId]
	};

	await dbconn.query(postUpdateQuery);

	// commentReplyContent为null会导致回复前面有null字样
	if (commentReplyContent != undefined && commentReplyContent != 'null') {
		content = `${commentReplyContent}\n\n${content}`;
	}

	// 向comment插入新的一行
	const commentInsertQuery = {
		text: `INSERT INTO comment 
      (id, belong_post_id, poster_name, poster_email, title, content,
      poster_cookies_id, post_timestamp)
    VALUES 
      (gen_random_uuid(), $1, $2, $3, $4, $5,
      $6, now())
    RETURNING id`,
		values: [postId, name, email, title, content, poster_cookies_id]
	};

	const commentInsertResult = await dbconn.query(commentInsertQuery);

	const commentId = commentInsertResult.rows[0].id;
  if (imageNames.length > 0) {
    const placeholder = generatePlaceholder(2, imageNames.length);
    // 更新 post_comment_image 表中对应的字段
    const updateImageQuery = {
      text: `UPDATE
        post_comment_image
      SET
        post_id = $1
      WHERE
        id IN (${placeholder}) AND post_id IS NULL
      `,
      values: [commentId, ...imageNames]
    };

    await dbconn.query(updateImageQuery);
  }
	return json({
		type: 'ok',
		commentId: commentId
	});
};
