import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth.js';

import { nullStringToEmpty } from '$lib/SendForm/string.js';

const CONTENT_MIN_LENGTH = 10;

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

	const name = nullStringToEmpty(formData?.get('name'));
	const email = nullStringToEmpty(formData?.get('email'));
	const title = nullStringToEmpty(formData?.get('title'));
	const content = formData?.get('content') ?? 'empty';
	const cookies = nullStringToEmpty(formData?.get('cookies'));

	/* 
	// 未提供cookies字段
	*/
	if (authRes.userType != 'admin' && cookies == null) {
		return json({
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: null
		});
	}

	/*
    // 正文内容太少
    {
        type: "error",
        errorCode: "CONTENT_LENGTH_TOO_SHORT"
    }
    */
	if (content == 'empty' || content.length < CONTENT_MIN_LENGTH) {
		return json({
			type: 'error',
			errorCode: 'CONTENT_LENGTH_TOO_SHORT'
		});
	}

	const [postPrefix, id] = postId.split('_');

	let searchQuery = null;
	if (postPrefix == 'post') {
		// 查找post表中的记录
		searchQuery = {
			text: `SELECT p.status, c.content AS cookies_content 
			FROM post AS p LEFT JOIN cookies AS c ON p.poster_cookies_id = c.id
			WHERE p.id = $1 LIMIT 1`,
			values: [id]
		};
	} else {
		// 查找comment表中的记录
		searchQuery = {
			text: `SELECT p.status, c.content AS cookies_content 
			FROM comment LEFT JOIN cookies AS c ON comment.poster_cookies_id = c.id
			INNER JOIN post AS p ON p.id = comment.belong_post_id
			WHERE comment.id = $1 LIMIT 1`,
			values: [id]
		};
	}

	const searchResult = await dbconn.query(searchQuery);

	// 不存在对应post或comment
	if (searchResult.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'POST_OR_COMMENT_ID_INVALID'
		});
	}

	// 如果不是admin则需要验证是否作者是对应饼干
	if (authRes.userType != 'admin') {
		if (searchResult.rows[0].cookies_content != cookies) {
			return json({
				type: 'error',
				errorCode: 'WRONG_COOKIES'
			});
		}

		if (searchResult.rows[0].status != 'repliable') {
			return json({
				type: 'error',
				errorCode: 'NOT_EDITABLE'
			});
		}
	}

	let tableName = postPrefix == 'post' ? 'post' : 'comment';

	const updateQuery = {
		text: `UPDATE ${tableName} SET 
            poster_name = $1,
            poster_email = $2,
            title = $3,
            content = $4,
            edit_timestamp = now()
        WHERE id = $5`,
		values: [name, email, title, content, id]
	};

	await dbconn.query(updateQuery);

	return json({
		type: 'ok'
	});
};
