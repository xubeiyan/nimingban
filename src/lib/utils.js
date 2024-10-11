import { createHash } from 'node:crypto';
// 生成随机盐字符串
const generateRandomSaltString = (length = 6) => {
	if (Number(length) != length) {
		length = 6;
	}
	const string = 'ABCDEFGHIJKLMNOPRQSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let generateString = '';
	for (let i = 0; i < length; ++i) {
		const index = Math.floor(Math.random() * string.length);
		generateString += string[index];
	}
	return generateString;
};

// 使用盐（salt）hash原始字符串（origin）
const hashStringWithSalt = (salt, origin) => {
	const hash = createHash('sha512');
	hash.update(`${origin}${salt}`);

	return hash.digest('hex');
};

export { generateRandomSaltString, hashStringWithSalt };