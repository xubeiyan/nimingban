import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth.js';

import { validCookies, validateImages } from '$lib/SendForm/validation.js';
import { uploadImages } from '$lib/SendForm/uploadImage.js';
import { nullStringToEmpty } from '$lib/SendForm/string.js';

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
	const formData = await request.formData();
	const toUploadImages = formData?.getAll('image');

	const name = nullStringToEmpty(formData?.get('name'));
	const email = nullStringToEmpty(formData?.get('email'));
	const title = nullStringToEmpty(formData?.get('title'));
	const content = nullStringToEmpty(formData?.get('content'));
	const cookies = nullStringToEmpty(formData?.get('cookies'));
	const commentReplyContent = nullStringToEmpty(formData?.get('commentReplyContent'));

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
	let { replaceImageUrlContent, uploaded } = uploadImages(content, toUploadImages);

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
		replaceImageUrlContent = `${commentReplyContent}\n\n${replaceImageUrlContent}`;
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
				id, 				image_type, exist_type, post_id, fullname
			) VALUES (
				gen_random_uuid(), 	$1,			'exist',	$2, $3
			)`,
			values: [one.type, comment_id, one.name]
		};

		await dbconn.query(imageInsertQuery);
	});

	return json({
		type: 'ok',
		commentId: comment_id
	});
};
