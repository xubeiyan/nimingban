import { createHash } from 'node:crypto';
// 生成随机盐字符串
const generateRandomSaltString = () => {
    return 'abcdef';
}

// 使用盐（salt）hash原始字符串（origin）
const hashStringWithSalt = (salt, origin) => {

    const hash = createHash('sha512');
    hash.update(`${origin}${salt}`);

    return hash.digest('hex');
}

export { generateRandomSaltString, hashStringWithSalt }