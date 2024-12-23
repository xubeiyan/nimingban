import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';

export const POST = async ({ request, params, locals }) => {
	const { dbconn } = locals;

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

	const id = params.id;

	let { status } = await request.json();

	status ??= '';
	if (status == '') {
		return json({
			type: 'error',
			errorCode: 'CHANGE_STATUS_NOT_FOUND'
		});
	}

	if (!['repliable', 'readonly', 'hidden'].includes(status)) {
		return json({
			type: 'error',
			errorCode: 'INVALID_STATUS'
		});
	}

	const modifyQuery = {
		text: `UPDATE post SET status = $1
        WHERE id = $2`,
		values: [status, id]
	};

	const modifyResult = await dbconn.query(modifyQuery);

	if (modifyResult.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'NOT_AFFECT_ROWS'
		});
	}

	return json({
		type: 'ok'
	});
};
