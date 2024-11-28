import { JWTAuth } from '$lib/auth.js';
import { json } from '@sveltejs/kit';
import { generateJWTToken } from '$lib/jwt.js';

import { JWTSECRET } from '$env/static/private';

export const GET = ({ request }) => {
	const authRes = JWTAuth(request);

	if (authRes.type != 'ok') {
		return json(authRes);
	}

	const payload = {
		username: authRes.username,
		type: authRes.userType,
		expire: new Date().getTime() + 1000 * 60 * 60
	};

	const token = generateJWTToken(payload, JWTSECRET);
	return json({
		type: 'ok',
		token
	});
};
