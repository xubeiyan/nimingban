import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';

export const POST = async ({ locals, request }) => {
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

	const { id, name } = await request.json();

	const updateQuery = {
		text: `UPDATE section SET section_name = $1 WHERE id = $2`,
		values: [name, id]
	};

	await dbconn.query(updateQuery);

	return json({
		type: 'ok'
	});
};
