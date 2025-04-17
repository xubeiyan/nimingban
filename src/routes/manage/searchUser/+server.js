import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';
import { getUserTypeValue } from '$lib/user/utils';

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

	let { username, start_date, end_date } = await request.json();

	let start_time = `2024-01-01 00:00:00`;

	if (start_date != null) {
		start_time = `${start_date}`;
	}

	let end_time = `${new Date().toISOString().substring(0, 10)} 23:59:59`;

	if (end_date != null) {
		end_time = `${end_time}`;
	}

	// 根据是否有 username 设置不同的SQL
	let userSeachQuery = {
		text: `SELECT id, username, status, type, reset_password,
        to_char(create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS create_time 
        FROM "user" WHERE create_timestamp >= $1 AND create_timestamp <= $2 
		ORDER BY create_timestamp DESC LIMIT 20`,
		values: [start_time, end_time]
	};

	if (username != null && username != '') {
		userSeachQuery = {
			text: `SELECT id, username, status, type, reset_password,
			to_char(create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS create_time 
			FROM "user" WHERE username = $3 
			AND create_timestamp >= $1 AND create_timestamp <= $2
			ORDER BY create_timestamp DESC`,
			values: [start_time, end_time, username]
		};
	}

	const userSearchResult = await dbconn.query(userSeachQuery);

	if (userSearchResult.rowCount == 0) {
		return json({
			type: 'ok',
			result: []
		});
	}

	return json({
		type: 'ok',
		result: userSearchResult.rows.map((r) => ({
			id: r.id,
			username: r.username,
			type: getUserTypeValue(r.type),
			status: r.status,
			createTime: r.create_time,
			resetPass: r.reset_password
		}))
	});
};
