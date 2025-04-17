import { json } from '@sveltejs/kit';

import { hashStringWithSalt } from '$lib/utils.js';
import { generateJWTToken } from '$lib/jwt.js';
import { getJWTSecretDB } from '$lib/auth.js';

import { DEFAULT_JWT_SECRET, DEFAULT_JWT_EXPIRE_MINUTE } from '$env/static/private';

export const POST = async ({ locals, request }) => {
	let { username, password } = await request.json();

	username ??= '';
	password ??= '';

	// 如果是空的则返回错误
	if (username == '' || password == '') {
		return json({
			type: 'error',
			errorCode: 'MISS_USERNAME_OR_PASSWORD'
		});
	}

	const { dbconn } = locals;
	const { secret, expire_minute } = await getJWTSecretDB(dbconn);

	const query = {
		text: `SELECT id, password_hash, password_salt, type, status, 
			to_char(create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS create_time, reset_password
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
		create_time: createTime,
		reset_password
	} = result.rows[0];

	// 此用户状态不是enable
	if (status != 'enable') {
		return json({
			type: 'error',
			errorCode: 'USER_NOT_ENABLE'
		});
	}

	// 判断是否处于找回状态，找回状态直接比较密码和此值
	if (reset_password != null) {
		if (password == reset_password) {
			return json({
				type: 'warning',
				warningCode: 'NEED_NEW_PASS'
			});
		}

		return json({
			type: 'error',
			errorCode: 'USERNAME_OR_PASSWORD_WRONG',
			extra: 'r p w'
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

	let jwtExpireMinute = DEFAULT_JWT_EXPIRE_MINUTE;
	if (expire_minute != undefined) {
		jwtExpireMinute = expire_minute;
	}

	// default expire time will be 1 hours later
	const payload = {
		username: encodeURI(username),
		type,
		expire: new Date().getTime() + 1000 * 60 * Number(jwtExpireMinute)
	};

	let jwtSecret = DEFAULT_JWT_SECRET;
	if (secret != undefined) {
		jwtSecret = secret;
	}

	const token = generateJWTToken(payload, jwtSecret);

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
