import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';

export const GET = async ({ params, request, locals }) => {
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

	const { dbconn } = locals;
	const { id } = params;

	const deleteCommentQuery = {
		text: `DELETE FROM comment WHERE belong_post_id = $1`,
		values: [id]
	};

	const deleteCommentResult = await dbconn.query(deleteCommentQuery);

	console.log(deleteCommentResult);

	const deletePostQuery = {
		text: `DELETE FROM post WHERE id = $1`,
		values: [id]
	};

	const deletePostResult = await dbconn.query(deletePostQuery);

	console.log(deletePostResult);

	return json({
		type: 'ok'
	});
};
