import { json } from '@sveltejs/kit';
import { JWTAuth,getJWTSecretDB } from '$lib/auth.js';


export const POST = async ({ request, locals }) => {
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


	const { name } = await request.json();

	const searchQuery = {
		text: `SELECT 1 FROM section WHERE section_name = $1`,
		values: [name]
	};

	const searchResult = await dbconn.query(searchQuery);

	if (searchResult.rowCount > 0) {
		return json({
			type: 'error',
			errorCode: 'DUPLICATE_SECTION_NAME'
		});
	}

	const insertQuery = {
		text: `INSERT INTO section (
            id, section_name, "order"
        ) VALUES (
            gen_random_uuid(), $1, (SELECT COUNT(*) + 1 AS count FROM section)
        ) RETURNING id`,
		values: [name]
	};

	const insertResult = await dbconn.query(insertQuery);

	const sectionId = insertResult.rows[0].id;

	return json({
		type: 'ok',
		sectionId
	});
};
