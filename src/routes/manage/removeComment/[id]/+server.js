import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';

export const GET = async ({ params, request, locals }) => {
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

	const { id } = params;

	const deleteCommentQuery = {
		text: `DELETE FROM comment WHERE id = $1`,
		values: [id]
	};

	const deleteCommentResult = await dbconn.query(deleteCommentQuery);

	return json({
		type: 'ok',
		commentCount: deleteCommentResult.rowCount
	});
};
