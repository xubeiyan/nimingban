// 验证是否携带Authorization字段且是否合理
import { verifyJWTToken } from '$lib/jwt.js';
import { DEFAULT_JWT_SECRET } from '$env/static/private';

export const JWTAuth = (req, jwtSecretDb) => {
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

	let jwtSecret = DEFAULT_JWT_SECRET;

	if (jwtSecretDb != undefined) {
		jwtSecret = jwtSecretDb;
	}

	if (!verifyJWTToken(base64Header, base64Payload, base64Signature, jwtSecret)) {
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
		userType: payload.type,
		expire: payload.expire
	};
};

// 从数据库中取jwt_secret和jwt_expire_minute
export const getJWTSecretDB = async (dbconn) => {
	const jwtQuery = {
		text: `SELECT data_type, value FROM site_settings 
		WHERE "name" = 'jwt_secret' LIMIT 1`
	};

	const jwtResult = await dbconn.query(jwtQuery);

	let jwtSecret = undefined;
	if (jwtResult.rowCount == 1 && jwtResult.rows[0].data_type == 'string') {
		jwtSecret = jwtResult.rows[0].value;
	}

	const jwtExpireQuery = {
		text: `SELECT data_type, value FROM site_settings
		WHERE "name" = 'jwt_expire_minute' LIMIT 1`
	};

	const jwtExpireResult = await dbconn.query(jwtExpireQuery);

	let jwtExpireMinute = undefined;
	if (jwtExpireResult.rowCount == 1 && jwtExpireResult.rows[0].data_type == 'number') {
		jwtExpireMinute = jwtExpireResult.rows[0].value;
	}

	return {
		secret: jwtSecret,
		expire_minute: jwtExpireMinute,
	};
};
