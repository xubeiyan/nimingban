import { json } from '@sveltejs/kit';
import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { connectToDB } from '$lib/db';
import { generateRandomSaltString, hashStringWithSalt } from '$lib/utils.js';

export const POST = async ({ request }) => {
	const dbconn = await connectToDB({
		host: PGHOST,
		user: PGUSER,
		pass: PGPASSWORD,
		port: PGPORT,
		database: PGDATABASE
	});

	let { username, password } = await request.json();

	username ??= '';
	password ??= '';

	// 如果是空值（undefined or null）则返回空值
	if (username == '' || password == '') {
		return json({
			type: 'error',
			errorCode: 'MISS_USERNAME_OR_PASSWORD'
		});
	}

	// 查询存在的用户
	const duplicateQuery = {
		text: `SELECT 1 FROM "user" WHERE username = $1 LIMIT 1`,
		values: [username]
	};

	const duplicateResult = await dbconn.query(duplicateQuery);

	if (duplicateResult.rowCount > 0) {
		return json({
			type: 'error',
			errorCode: 'USERNAME_DUPLICATE'
		});
	}

	// 随机一串盐字符串
	const salt = generateRandomSaltString();

	// 使用哈希算法对其hash
	const hashWithSalt = hashStringWithSalt(salt, password);

	const query = {
		text: `INSERT INTO "user" (
        id, 				status, 	username, 	password_hash, 	password_salt, 	type, 		create_timestamp
        ) VALUES (
        gen_random_uuid(), 'enable', 	$1, 		$2, 			$3, 			'admin', 	now()
        )`,
		values: [username, hashWithSalt, salt]
	};

	await dbconn.query(query);

	return json({
		type: 'ok'
	});
};
