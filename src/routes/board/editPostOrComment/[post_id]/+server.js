import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth.js';

import { nullToDefaultString } from '$lib/SendForm/string.js';

const CONTENT_MIN_LENGTH = 10;

export const POST = async ({ locals, params, request }) => {
	const { dbconn } = locals;
	const { secret: jwt } = await getJWTSecretDB(dbconn);
	const authRes = JWTAuth(request, jwt);

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	// 不是admin不允许操作
	if (authRes.userType != 'admin') {
		return json({
			type: 'error',
			errorCode: 'OPERATION_NOT_ALLOWED'
		});
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

	const name = nullToDefaultString(formData?.get('name'));
	const email = nullToDefaultString(formData?.get('email'));
	const title = nullToDefaultString(formData?.get('title'));
	const content = formData?.get('content') ?? 'empty';

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

	const postPrefix = postId.split('_').at(0);
	const id = postId.split('_').at(1);

	let tableName = 'post';
	if (postPrefix == 'comment') {
		tableName = 'comment';
	}

	// 查找post表中的记录
	const postSearchQuery = {
		text: `SELECT 1 FROM ${tableName} WHERE id = $1 LIMIT 1`,
		values: [id]
	};

	const postSearchResult = await dbconn.query(postSearchQuery);

	// 不存在对应post或comment
	if (postSearchResult.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'POST_OR_COMMENT_ID_INVALID'
		});
	}

	const postUpdateQuery = {
		text: `UPDATE ${tableName} SET 
            poster_name = $1,
            poster_email = $2,
            title = $3,
            content = $4,
            edit_timestamp = now()
        WHERE id = $5`,
		values: [name, email, title, content, id]
	};

	await dbconn.query(postUpdateQuery);

	return json({
		type: 'ok'
	});
};
