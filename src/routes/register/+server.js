import { json } from '@sveltejs/kit';

import { generateRandomSaltString, hashStringWithSalt } from '$lib/utils.js';

export async function POST({ locals, request }) {
	const { username, password } = await request.json();

	const { dbconn } = locals;
	const query = {
		text: `SELECT 1 FROM "user" WHERE username = $1 LIMIT 1`,
		values: [username]
	};
	const result = await dbconn.query(query);

	/* 
	用户名已存在
	返回JSON
	{
		"type": "error",
		"errorCode": "USER_NAME_EXISTS" 
	}
	*/
	if (result.rows.length > 0) {
		return json({ type: 'error', errorCode: 'USER_NAME_EXISTS' });
	}

	// 随机一串盐字符串
	const salt = generateRandomSaltString();

	// 使用哈希算法对其hash
	const hashWithSalt = hashStringWithSalt(salt, password);

	const createUserQuery = {
		text: `INSERT INTO "user"
			(id, 				status, 	username, 	password_hash, 	password_salt, 	type, 	create_timestamp) VALUES 
			(gen_random_uuid(), 'enable', 	$1, 		$2, 			$3, 			'user', now())`,
		values: [username, hashWithSalt, salt]
	};

	const createResult = await dbconn.query(createUserQuery);

	if (createResult.rowCount == null) {
		return json({
			type: 'warning',
			errorCode: 'NOT_AFFECT_ROWS'
		});
	}

	return json({ type: 'OK' });
}
