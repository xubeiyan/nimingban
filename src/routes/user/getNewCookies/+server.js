import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';
import { generateCookiesString } from '$lib/utils.js';

import { COOKIES_LIMIT } from '$env/static/private';

export const GET = async ({ locals, request }) => {
	const authRes = JWTAuth(request);

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	const { dbconn } = locals;

	// 查询对应user的id
	const user_query = {
		text: `SELECT id FROM "user" WHERE username = $1 LIMIT 1`,
		values: [authRes.username]
	};

	const user_result = await dbconn.query(user_query);

	if (user_result.rowCount != 1) {
		return json({
			type: 'error',
			errorCode: 'NO_SUCH_USER'
		});
	}

	// 查询已有的cookie数量
	const user_id = user_result.rows[0].id;
	const cookies_query = {
		text: `SELECT 
            COUNT(*) AS total_count,
            COUNT(*) FILTER (WHERE belong_user_id = $1) AS cookies_count
         FROM cookies`,
		values: [user_id]
	};

	const cookies_result = await dbconn.query(cookies_query);

	if (cookies_result.rows[0].cookies_count >= COOKIES_LIMIT) {
		return json({
			type: 'error',
			errorCode: 'REACH_COOKIES_LIMIT'
		});
	}

	const total_count = cookies_result.rows[0].total_count;

	const next_cookies_content = generateCookiesString(total_count);

	// 添加新的cookies
	const new_cookies_query = {
		text: `INSERT INTO cookies 
        (id,                    belong_user_id, create_timestamp,   expire_timestamp,           content,    status) VALUES
        (gen_random_uuid(),     $1,             now(),              now() + interval '1 year',  $2,         'enable')`,
		values: [user_id, next_cookies_content]
	};

	await dbconn.query(new_cookies_query);

	// 再次查询当前用户的所有cookies
	const select_cookies_query = {
		text: `SELECT content, status, to_char(expire_timestamp, 'YYYY-MM-DD HH:MI:SS') AS expire_time FROM cookies 
        WHERE belong_user_id = $1`,
		values: [user_id]
	};

	const select_cookies_result = await dbconn.query(select_cookies_query);

    console.log(select_cookies_result)
	const cookies = select_cookies_result.rows.map((one) => {
		return {
			content: one.content,
			status: one.status,
			expire_time: one.expire_time
		};
	});

	return json({
		type: 'ok',
		cookies
	});
};
