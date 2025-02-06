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

	const { id, minPostSecond, accessType, name, url, intro } = await request.json();

	const updateQuery = {
		text: `UPDATE board SET 
            min_post_second = $2,
            access_type = $3,
            name = $4,
            url_name = $5,
            intro = $6
        WHERE id = $1`,
		values: [id, minPostSecond, accessType, name, url, intro]
	};

	const result = await dbconn.query(updateQuery);

	if (result.rowCount != 1) {
		return json({
			type: 'warning',
			warningCode: 'NOT_AFFECT_ONE_ROW'
		});
	}
	return json({
		type: 'ok'
	});
};
