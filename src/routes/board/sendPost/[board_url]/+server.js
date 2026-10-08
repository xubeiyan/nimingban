import { json } from '@sveltejs/kit';

import { JWTAuth, getJWTSecretDB } from '$lib/auth.js';

import { validCookies, validateImages } from '$lib/SendForm/validation.js';
import { uploadImages } from '$lib/SendForm/uploadImage.js';
import { nullStringToEmpty } from '$lib/SendForm/string.js';
import { generatePlaceholder } from '$lib/utils.js';

import { CONTENT_MIN_LENGTH } from '$env/static/private';

export async function POST({ locals, request, params }) {
	const { dbconn } = locals;
	const { secret: jwt } = await getJWTSecretDB(dbconn);
	const authRes = JWTAuth(request, jwt);
	const { board_url } = params;

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	const jsonData = await request.json();
  // 获取 发帖用户名，邮件，标题，内容，饼干，图片的名称
	const { name, email, title, content, cookies, imageNames = [] } = jsonData;

	/* 
	// 未提供cookies字段
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

	// 写入数据库
	// 查找board是否存在
	const boardSearchQuery = {
		text: `
    SELECT
      id, min_post_second, access_type, 
		  to_char(min_post_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS min_post_time,
		  to_char(now(), 'YYYY-MM-DD HH24:MI:SS') AS current_time 
		FROM 
      board 
    WHERE 
      url_name = $1 LIMIT 1`,
		values: [board_url]
	};
	const boardSearchResult = await dbconn.query(boardSearchQuery);

	if (boardSearchResult.rowCount != 1) {
		return json({
			type: 'error',
			errorCode: 'BOARD_NOT_EXIST'
		});
	}

	// 是否在发帖限制时间内
	const { id: board_id, min_post_second, min_post_time, current_time } = boardSearchResult.rows[0];

	const next_send_time = min_post_second * 1000 + new Date(min_post_time).getTime();
	const this_send_time = new Date(current_time).getTime();

	if (next_send_time > this_send_time) {
		return json({
			type: 'error',
			errorCode: 'POST_TOO_FAST',
			extra: (next_send_time - this_send_time) / 1000
		});
	}

	// 是否允许发帖
	if (boardSearchResult.rows[0].access_type != 'all') {
		return json({
			type: 'error',
			errorCode: 'NOT_SEND_POST_IN_THIS_BOARD'
		});
	}

	const postInsertQuery = {
		text: `INSERT INTO 
      post 
      (id, status, poster_name, poster_email, title, content, poster_cookies_id, 
      post_timestamp, last_reply_timestamp, belong_board_id) 
    VALUES 
      (gen_random_uuid(),	'repliable', $1, $2, $3, $4, $5, 
      now(), now(), $6
		) RETURNING id`,
		values: [name, email, title, content, poster_cookies_id, board_id]
	};

	const boardInsertResult = await dbconn.query(postInsertQuery);
	// 更新板块的最后发帖时间
	const updateBoardQuery = {
		text: `UPDATE board SET min_post_timestamp = now() WHERE id = $1`,
		values: [board_id]
	};

	await dbconn.query(updateBoardQuery);

  if (imageNames.length > 1) {
    const post_id = boardInsertResult.rows[0].id;
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
      values: [post_id, ...imageNames]
    };

    await dbconn.query(updateImageQuery);
  }
	return json({
		type: 'ok'
	});
}
