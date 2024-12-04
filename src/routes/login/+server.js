import { json } from '@sveltejs/kit';

import { hashStringWithSalt } from '$lib/utils.js';
import { generateJWTToken } from '$lib/jwt.js';

import { JWTSECRET } from '$env/static/private';

export const POST = async ({ locals, request }) => {
	const { username, password } = await request.json();

	const { dbconn } = locals;
	const query = {
		text: `SELECT id, password_hash, password_salt, type, status, 
			to_char(create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS create_time
			FROM "user" WHERE username = $1 LIMIT 1`,
		values: [username]
	};
	const result = await dbconn.query(query);

	// 没有找到此用户
	if (result.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'USERNAME_OR_PASSWORD_WRONG',
			extra: 'u n e'
		});
	}

	const {
		id,
		password_hash,
		password_salt,
		type,
		status,
		create_time: createTime
	} = result.rows[0];

	// 此用户状态不是enable
	if (status != 'enable') {
		return json({
			type: 'error',
			errorCode: 'USER_NOT_ENABLE'
		});
	}

	//
	const to_password_hash = hashStringWithSalt(password_salt, password);
	if (to_password_hash != password_hash) {
		return json({
			type: 'error',
			errorCode: 'USERNAME_OR_PASSWORD_WRONG',
			extra: 'p w'
		});
	}

	// expire time will be 1 hours later
	const payload = {
		username,
		type,
		expire: new Date().getTime() + 1000 * 60 * 60
	};

	const token = generateJWTToken(payload, JWTSECRET);

	const cookies_query = {
		text: `SELECT 
			to_char(expire_timestamp, 'YYYY-MM-DD HH:MI:SS') AS expire_time, 
			content, status
			FROM cookies 
			WHERE belong_user_id = $1 LIMIT 10`,
		values: [id]
	};

	const cookies_result = await dbconn.query(cookies_query);

	let cookies = [];
	cookies_result.rows.forEach((one) => {
		cookies.push(one);
	});

	return json({
		type: 'OK',
		user: {
			username,
			createTime,
			type,
			token,
			cookies
		}
	});
};
