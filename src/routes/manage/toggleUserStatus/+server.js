import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth';

export const POST = async ({ request, locals }) => {
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

	const { type, id, status } = await request.json();

	if (!['user', 'cookie'].includes(type)) {
		return json({
			type: 'error',
			errorCode: 'WRONG_TYPE'
		});
	}

	if (!['enable', 'disable'].includes(status)) {
		return json({
			type: 'error',
			errorCode: 'WRONG_STATUS'
		});
	}

	let updateResult;

	const { dbconn } = locals;

	if (type == 'user') {
		const updateUserQuery = {
			text: `UPDATE "user" SET status = $1 WHERE id = $2`,
			values: [status, id]
		};

		updateResult = await dbconn.query(updateUserQuery);
	} else if (type == 'cookie') {
		const updateCookieQuery = {
			text: `UPDATE cookies SET status = $1 WHERE id = $2`,
			values: [status, id]
		};

		updateResult = await dbconn.query(updateCookieQuery);
	}

	if (updateResult.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'NOT_AFFECT_ROWS'
		});
	}

	return json({
		type: 'ok'
	});
};
