import { json } from '@sveltejs/kit';

import { hashStringWithSalt } from '$lib/utils.js';
import { generateJWTToken } from '$lib/jwt.js';

export const POST = async ({ locals, request }) => {
	const { username, password } = await request.json();

	const { dbconn } = locals;
	const query = {
		text: `SELECT password_hash, password_salt, type, status FROM "user" WHERE username = $1 LIMIT 1`,
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

	const { password_hash, password_salt, type, status } = result.rows[0];

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
		expire: Date.now() + 1000 * 60 * 60
	};

	const KEY = 'nimingban20241011';

	const token = generateJWTToken(payload, KEY);

	return json({
		type: 'OK',
		user: {
			username,
			type,
			token
		}
	});
};
