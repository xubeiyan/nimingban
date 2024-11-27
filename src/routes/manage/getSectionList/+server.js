import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';

export const GET = async ({ locals, request }) => {
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

	// 查询section表
	const result = await dbconn.query(`SELECT id, section_name FROM section ORDER BY "order"`);

	let forumList = result.rows.map((one) => ({
		id: one.id,
		name: one.section_name
	}));

	return json({
		type: 'ok',
		forumList
	});
};
