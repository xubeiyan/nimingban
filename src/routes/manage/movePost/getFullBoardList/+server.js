import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';

export const GET = async ({ locals, request }) => {
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

	const query = {
		text: `SELECT 
            s.section_name, 
            b.id AS board_id, b.name AS board_name, b.url_name AS board_url
          FROM section AS s JOIN board AS b ON 
            s.id = b.parent_section_id 
		      ORDER BY s.order, b.order;`
	};

	const result = await dbconn.query(query);

	if (request.rowCount == 0) {
		return json({
      type: 'ok',
			forums: []
		});
	}

	const forums = result.rows.map((one) => ({
		id: one.board_id,
		board_url: one.board_url,
		board_name: one.board_name,
		section_name: one.section_name
	}));

	return json({
    type: 'ok',
		forums
	});
};
