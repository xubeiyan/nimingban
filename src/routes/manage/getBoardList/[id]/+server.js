import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';

export const GET = async ({ locals, request, params }) => {
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

	// 查询section表
	const result = await dbconn.query({
		text: `SELECT id, min_post_second, access_type, name, url_name, intro 
            FROM board WHERE parent_section_id = $1 ORDER BY "order"`,
		values: [id]
	});

	return json({
		type: 'ok',
		boards: result.rows
	});
};
