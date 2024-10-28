import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';
import { generateCookiesString } from '$lib/utils.js';

import { COOKIES_LIMIT } from '$env/static/private';
import { isMoreThanTillNow } from '$lib/getNewCookies/time.js';

export const GET = async ({ locals, request }) => {
	const authRes = JWTAuth(request);

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	const { dbconn } = locals;

	// 查询对应user的id
	const user_query = {
		text: `SELECT id, 
		to_char(create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS create_time 
		FROM "user" WHERE username = $1 LIMIT 1`,
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
	const { id: user_id, create_time } = user_result.rows[0];
	const cookies_query = {
		text: `SELECT 
            COUNT(*) AS total_count,
            COUNT(*) FILTER (WHERE belong_user_id = $1) AS cookies_count
         FROM cookies`,
		values: [user_id]
	};

	const cookies_result = await dbconn.query(cookies_query);

	/**
	 * 到达最大cookie数量
	 */
	const { total_count, cookies_count } = cookies_result.rows[0];
	if (cookies_count >= COOKIES_LIMIT) {
		return json({
			type: 'error',
			errorCode: 'REACH_COOKIES_LIMIT'
		});
	}

	/**
	 * 申请第一个须达到1天注册
	 */

	if (cookies_count == 0 && !isMoreThanTillNow(create_time, '1 day')) {
		return json({
			type: 'error',
			errorCode: 'COOKIES_GETTIME_LIMIT',
			extra: '1st need 1 day'
		});
	}

	/**
	 * 申请第二个须达到7天注册
	 */

	if (cookies_count == 1 && !isMoreThanTillNow(create_time, '30 days')) {
		return json({
			type: 'error',
			errorCode: 'COOKIES_GETTIME_LIMIT',
			extra: '2nd need 30 days'
		});
	}

	/**
	 * 申请第三个须达到30天注册
	 */

	if (cookies_count == 2 && !isMoreThanTillNow(create_time, '90 days')) {
		return json({
			type: 'error',
			errorCode: 'COOKIES_GETTIME_LIMIT',
			extra: '3rd need 90 days'
		});
	}

	/**
	 * 申请第四个须达到180天注册
	 */

	if (cookies_count == 3 && !isMoreThanTillNow(create_time, '180 days')) {
		return json({
			type: 'error',
			errorCode: 'COOKIES_GETTIME_LIMIT',
			extra: '4th need 180 days'
		});
	}

	/**
	 * 申请第五个须达到365天注册
	 */

	if (cookies_count == 4 && !isMoreThanTillNow(create_time, '365 days')) {
		return json({
			type: 'error',
			errorCode: 'COOKIES_GETTIME_LIMIT',
			extra: '5th need 365 days'
		});
	}

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
		text: `SELECT content, status, to_char(expire_timestamp, 'YYYY-MM-DD 24HH:MI:SS') AS expire_time FROM cookies 
        WHERE belong_user_id = $1`,
		values: [user_id]
	};

	const select_cookies_result = await dbconn.query(select_cookies_query);

	// console.log(select_cookies_result)
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
