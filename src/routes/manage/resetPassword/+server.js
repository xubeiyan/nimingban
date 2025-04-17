import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';
import { generateRandomSaltString } from '$lib/utils.js';

export const POST = async ({ request, locals }) => {
	const { dbconn } = locals;
	const { secret: jwt } = await getJWTSecretDB(dbconn);
	const authRes = JWTAuth(request, jwt);

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	// 不是admin不允许操作
	if (authRes.userType != 'admin') {
		return json({
			type: 'error',
			errorCode: 'OPERATION_NOT_ALLOWED'
		});
	}

	let { user_id } = await request.json();

	const getUserQuery = {
		text: `SELECT type, reset_password 
        FROM "user" 
        WHERE id = $1 LIMIT 1`,
		values: [user_id]
	};

	const getUserResult = await dbconn.query(getUserQuery);

	if (getUserResult.rowCount != 1) {
		return json({
			type: 'error',
			errorCode: 'USER_NOT_EXIST'
		});
	}

	const { type, reset_password } = getUserResult.rows[0];

	// 不能重置管理员密码
	if (type == 'admin') {
		return json({
			type: 'error',
			errorCode: 'NOT_ABLE_RESET_ADMIN'
		});
	}

	// 如果已经处于重置状态
	if (reset_password != null) {
		const updateUserQuery = {
			text: `UPDATE "user" SET reset_password = null
            WHERE id = $1`,
			values: [user_id]
		};

		await dbconn.query(updateUserQuery);

		return json({
			type: 'ok',
			user: {
                id: user_id,
				temp_pass: null
			}
		});
	}

	const temp_pass = generateRandomSaltString(64);

	const updateUserQuery = {
		text: `UPDATE "user" SET reset_password = $1 
        WHERE id = $2`,
		values: [temp_pass, user_id]
	};

	await dbconn.query(updateUserQuery);

	return json({
		type: 'ok',
		user: {
			id: user_id,
			temp_pass
		}
	});
};
