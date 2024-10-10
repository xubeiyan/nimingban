import { json } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
	const { username, password } = await request.json();

	const { dbconn } = locals;
	const query = {
		text: `SELECT password_hash, password_salt, type, status FROM "user" WHERE username = $1 LIMIT 1`,
		values: [username]
	};
	const result = await dbconn.query(query);

	if (result.rowCount == 0) {
		// 没有找到此用户
		return json({
			type: 'error',
			errorCode: 'USERNAME_OR_PASSWORD_WRONG'
		});
	}
    
	console.log(result);

	return json();
};
