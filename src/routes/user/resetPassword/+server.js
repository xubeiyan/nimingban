import { json } from '@sveltejs/kit';

import { generateRandomSaltString, hashStringWithSalt } from '$lib/utils.js';

export const POST = async ({ locals, request }) => {
	let { username, password, reset_code } = await request.json();

	username ??= '';
	password ??= '';
	reset_code ??= '';

	// 如果是空的则返回错误
	if (username == '' || password == '' || reset_code == '') {
		return json({
			type: 'error',
			errorCode: 'MISS_USERNAME_OR_PASSWORD_OR_RESETCODE'
		});
	}

	const { dbconn } = locals;

	const validateQuery = {
		text: `SELECT id FROM "user" WHERE username = $1
        AND status = 'enable' AND reset_password = $2 LIMIT 1`,
		values: [username, reset_code]
	};

	const validateResult = await dbconn.query(validateQuery);

	if (validateResult.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'NO_USER_FOR_PASSWORD_RESET'
		});
	}

	const id = validateResult.rows[0].id;

	// 随机一串盐字符串
	const salt = generateRandomSaltString();

	// 使用哈希算法对其hash
	const hashWithSalt = hashStringWithSalt(salt, password);

	const updateQuery = {
		text: `UPDATE "user" SET 
            password_hash = $2, password_salt = $3, reset_password = NULL
        WHERE id = $1`,
		values: [id, hashWithSalt, salt]
	};

	const updateResult = await dbconn.query(updateQuery);

	if (updateResult.rowCount == 0) {
		console.log('update not affect row');
	}

	return json({
		type: 'ok'
	});
};
