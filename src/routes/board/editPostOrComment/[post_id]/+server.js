import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';

const CONTENT_MIN_LENGTH = 10;

export const POST = async ({ locals, params, request }) => {
	const authRes = JWTAuth(request);

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

	const postId = params.post_id;
	if (postId == undefined || postId == null) {
		return json({
			type: 'error',
			errorCode: 'INVAILD_POST_ID',
			extra: 'n p i'
		});
	}
	const formData = await request.formData();

	const name = formData?.get('name');
	const email = formData?.get('email');
	const title = formData?.get('title');
	const content = formData?.get('content');

	const { dbconn } = locals;

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

	const postPrefix = postId.split('_').at(0);
	const id = postId.split('_').at(1);

	let tableName = null;
	if (postPrefix == 'comment') {
		tableName = 'comment';
	} else {
		tableName = 'post';
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
