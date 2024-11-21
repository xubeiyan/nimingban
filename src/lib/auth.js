// 验证是否携带Authorization字段且是否合理
import { verifyJWTToken } from '$lib/jwt.js';
import { JWTSECRET } from '$env/static/private';

export const JWTAuth = (req) => {
	// 验证请求头是否有Bearer 'ey...'的Authorization字段
	const tokenWithBearer = req.headers.get('Authorization');
	if (tokenWithBearer == undefined) {
		return {
			type: 'error',
			errorCode: 'NO_AUTHORIZATION_HEADER'
		};
	}

	const token = tokenWithBearer.split(' ')[1];
	if (token == undefined) {
		return {
			type: 'error',
			errorCode: 'NO_AUTHORIZATION_HEADER'
		};
	}

	// 验证此JWT未经过篡改
	const [base64Header, base64Payload, base64Signature] = token.split('.');

	if (base64Header == undefined || base64Payload == undefined || base64Signature == undefined) {
		return {
			type: 'error',
			errorCode: 'COOKIES_MALFORM'
		};
	}

	if (!verifyJWTToken(base64Header, base64Payload, base64Signature, JWTSECRET)) {
		return {
			type: 'error',
			errorCode: 'INVALID_AUTHORIZATION_HEADER'
		};
	}

	// 似乎在node中atob会自动补齐后面的=
	const payloadOriginStr = atob(base64Payload);
	const payload = JSON.parse(payloadOriginStr);

	const expireTimestamp = new Date(payload.expire).getTime();

	if (expireTimestamp < Date.now()) {
		return {
			type: 'error',
			errorCode: 'AUTHORIZATION_EXPIRE'
		};
	}

	return {
		type: 'ok',
		username: payload.username,
		userType: payload.type
	};
};
