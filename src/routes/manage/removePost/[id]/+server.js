import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB} from '$lib/auth';

export const GET = async ({ params, request, locals }) => {
	const jwt = await getJWTSecretDB(dbconn);
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

	const { dbconn } = locals;
	const { id } = params;

	const deletePostQuery = {
		text: `DELETE FROM post WHERE status = 'hidden' AND id = $1`,
		values: [id]
	};

	const deletePostResult = await dbconn.query(deletePostQuery);

	const postCount = deletePostResult.rowCount;
	if (postCount != 1) {
		return json({
			type: 'error',
			errorCode: 'SUCH_POST_NOT_EXIST'
		});
	}

	const deleteCommentQuery = {
		text: `DELETE FROM comment WHERE belong_post_id = $1`,
		values: [id]
	};

	const deleteCommentResult = await dbconn.query(deleteCommentQuery);

	return json({
		type: 'ok',
		postCount,
		commentCount: deleteCommentResult.rowCount
	});
};
