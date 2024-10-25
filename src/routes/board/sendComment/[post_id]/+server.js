import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';

import { validCookies, validateImages } from '$lib/SendForm/validation.js';
import { uploadImages } from '$lib/SendForm/uploadImage.js';

const CONTENT_MIN_LENGTH = 10;

export const POST = async ({ locals, params, request }) => {
	const authRes = JWTAuth(request);
	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	const postId = params.post_id;
	if (postId == undefined || postId == null) {
		return json({
			type: 'error',
			errorCode: 'INVAILD_POST_ID',
			extra: 'n p i'
		});
	}
	const formData = await request.formData();
	const toUploadImages = formData?.getAll('image');

	const name = formData?.get('name');
	const email = formData?.get('email');
	const title = formData?.get('title');
	const content = formData?.get('content');
	const cookies = formData?.get('cookies');

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

	const { dbconn } = locals;

	// 验证cookie
	const cookies_result = await validCookies({ dbconn, cookies, authUsername: authRes.username });

	if (cookies_result.type == 'error') {
		return json(cookies_result);
	}

	const { poster_cookies_id } = cookies_result;

	// 验证图片
	const image_validate_result = await validateImages({ toUploadImages });

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

	// 上传图片
	const { replaceImageUrlContent, uploaded } = uploadImages(content, toUploadImages);

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

	// 向comment插入新的一行
	const commentInsertQuery = {
		text: `INSERT INTO comment (
            id,                 belong_post_id, poster_name,    poster_email,   title,  content, poster_cookies_id, post_timestamp
        ) VALUES (
            gen_random_uuid(),  $1,             $2,             $3,             $4,     $5,     $6,                 now()        
        ) RETURNING id`,
		values: [postId, name, email, title, replaceImageUrlContent, poster_cookies_id]
	};

	const commentInsertResult = await dbconn.query(commentInsertQuery);

	const comment_id = commentInsertResult.rows[0].id;

	uploaded.forEach(async (one) => {
		const imageInsertQuery = {
			text: `INSERT INTO post_comment_image (
				id, 				image_type, exist_type, post_id
			) VALUES (
				gen_random_uuid(), 	$1,			'exist',	$2
			)`,
			values: [one.type, comment_id]
		};

		await dbconn.query(imageInsertQuery);
	});

	return json({});
};
