import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';

export const POST = async ({ locals, request }) => {
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

	let { post_id, to_board_id } = await request.json();

	post_id ??= 'invalid';
	to_board_id ??= 'invalid';

	// 移动的串id
	if (post_id == 'invalid') {
		return json({
			type: 'error',
			errorCode: 'INVAILD_POST_ID',
			extra: 'n p i'
		});
	}

	// 要移动到的版块id
	if (to_board_id == 'invalid') {
		return json({
			type: 'error',
			errorCode: 'INVAILD_TO_BOARD_ID',
			extra: 'n b i'
		});
	}

	const query = {
		text: `UPDATE post SET belong_board_id = $1 WHERE id = $2`,
		values: [to_board_id, post_id]
	};

	const result = await dbconn.query(query);

	if (result.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'NO_AFFECT_ROW'
		});
	}

	return json({
		type: 'ok'
	});
};
