import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';

export const POST = async ({ request, locals }) => {
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

	let { username, cookie } = await request.json();

	username ??= '';
	cookie ??= '';

	if (username != '') {
		const userSeachQuery = {
			text: `SELECT u.id AS user_id, u.username, u.status AS user_status, u.type,
			to_char(u.create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS user_create_time,
			c.id AS cookie_id, c.content, c.status AS cookie_status,
			to_char(c.create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS cookie_create_time
			FROM "user" AS u 
			INNER JOIN cookies AS c
			ON u.id = c.belong_user_id AND u.username = $1`,
			values: [username]
		};

		const userSearchResult = await dbconn.query(userSeachQuery);

		if (userSearchResult.rowCount == 0) {
			return json({
				type: 'ok',
				result: []
			});
		}

		return json({
			type: 'ok',
			result: userSearchResult.rows
		});
	}

	const searchQuery = {
		text: `SELECT c.id AS cookie_id, c.content, c.status AS cookie_status, 
        to_char(c.create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS cookie_create_time,
        u.id AS user_id, u.username, u.status AS user_status, u.type,
        to_char(u.create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS user_create_time
        FROM cookies AS c 
        INNER JOIN "user" AS u ON c.belong_user_id = u.id AND c.content = $1`,
		values: [cookie]
	};

	const searchResult = await dbconn.query(searchQuery);

	if (searchResult.rowCount == 0) {
		return json({
			type: 'ok',
			result: []
		});
	}

	return json({
		type: 'ok',
		result: searchResult.rows
	});
};
