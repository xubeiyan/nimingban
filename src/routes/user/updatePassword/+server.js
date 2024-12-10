import { JWTAuth, getJWTSecretDB } from '$lib/auth';
import { generateRandomSaltString, hashStringWithSalt } from '$lib/utils.js';
import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const { dbconn } = locals;
	const jwt = await getJWTSecretDB(dbconn);
	const authRes = JWTAuth(request, jwt);

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	// 查询对应user的password_hash和password_salt
	const user_query = {
		text: `SELECT password_hash, password_salt
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

	const { oldPass, newPass } = await request.json();
	const { password_hash: hash, password_salt: salt } = user_result.rows[0];

	if (hashStringWithSalt(salt, oldPass) != hash) {
		return json({
			type: 'error',
			errorCode: 'OLD_PASSWORD_WRONG'
		});
	}

	// 如果newPass太短不允许使用
	if (newPass == null || newPass == undefined || newPass.length == 0) {
		return json({
			type: 'error',
			errorCode: 'NEW_PASSWORD_TOO_SHORT'
		});
	}

	const newSalt = generateRandomSaltString();
	const newPassHash = hashStringWithSalt(newSalt, newPass);

	const update_query = {
		text: `UPDATE "user" SET 
            password_hash = $1,
            password_salt = $2
        WHERE username = $3`,
		values: [newPassHash, newSalt, authRes.username]
	};

	await dbconn.query(update_query);

	return json({
		type: 'ok'
	});
};
