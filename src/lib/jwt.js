import { createHmac } from 'node:crypto';

const base64UrlEncode = (text) => {
	return btoa(text).replace(/=/g, '');
};

// 生成JWT token
const generateJWTToken = (payload, key) => {
	const hmac = createHmac('sha256', key);
	const header = {
		alg: 'HS256',
		typ: 'JWT'
	};

	const base64Header = base64UrlEncode(JSON.stringify(header));
	const base64Payload = base64UrlEncode(JSON.stringify(payload));

	const zzz = hmac
		.update(`${base64Header}.${base64Payload}`)
		.digest('base64')
		.replace(/\//g, '_')
		.replace(/\+/g, '-')
		.replace(/=/g, '');

	return `${base64Header}.${base64Payload}.${zzz}`;
};

// 验证JWT token
const verifyJWTToken = (base64Header, base64Payload, base64Signature, key) => {
	const hmac = createHmac('sha256', key);
	const zzz = hmac
		.update(`${base64Header}.${base64Payload}`)
		.digest('base64')
		.replace(/\//g, '_')
		.replace(/\+/g, '-')
		.replace(/=/g, '');
	if (zzz == base64Signature) {
		return true;
	}
	return false;
};

const parseJWTTokenPayload = (payload) => {};

export { generateJWTToken, verifyJWTToken };
