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

	const { name, value } = await request.json();

	if (name == null || value == null) {
		return json({
			type: 'error',
			errorCode: 'INVALID_NAME_OR_VALUE'
		});
	}

	const query = {
		text: `UPDATE site_settings SET "value" = $1 WHERE "name" = $2`,
		values: [value, name]
	};

	const result = await dbconn.query(query);

	if (result.rowCount != 1) {
		return json({
			type: 'error',
			errorCode: 'NOT_AFFECT_ROWS'
		});
	}

	return json({
		type: 'ok'
	});
};
