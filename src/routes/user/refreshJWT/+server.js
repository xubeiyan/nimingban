import { JWTAuth, getJWTSecretDB } from '$lib/auth';
import { json } from '@sveltejs/kit';
import { generateJWTToken } from '$lib/jwt.js';

import { DEFAULT_JWT_SECRET } from '$env/static/private';

export const GET = async ({ request, locals }) => {
	const { dbconn } = locals;
	const jwt = await getJWTSecretDB(dbconn);
	const authRes = JWTAuth(request, jwt);

	if (authRes.type != 'ok') {
		return json(authRes);
	}

	const payload = {
		username: authRes.username,
		type: authRes.userType,
		expire: new Date().getTime() + 1000 * 60 * 60
	};

	let jwtSecret = DEFAULT_JWT_SECRET;
	if (jwt != undefined) {
		jwtSecret = jwt;
	}

	const token = generateJWTToken(payload, jwtSecret);
	return json({
		type: 'ok',
		token
	});
};
