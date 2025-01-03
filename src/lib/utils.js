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

// 生成饼干字符串（根据index）
/**
 * 第一行偏移是
 * index % tempLen
 * 第二行偏移是
 * index % tempLen +
 * 	Math.floor(index / tempLen)
 * 第三行偏移是
 * index % tempLen +
 * 	Math.floor(Math.floor(index / tempLen) / tempLen)
 * 以此类推
 * 生成顺序是'ZxDWTC' 'GcFDcI' 'uV0QbU'...
 * 'GxDWTC' 'ucFDcI' 'NV0QbU'...
 */
const generateCookiesString = (index) => {
	const template = [
		'ZGuNHcDwpsObhYegLBylm8rTan34xMAiqKdVJXS6W2RCQ5EtzkvofPj79FIU01',
		'xcVoaGAdHUMK3RJjEvNS8IsXw2hOrY75npDZWlu0kbt6C1qLmeFz9TfBgQiyP4',
		'DF0vaXlW7u5Y2ZjpSb96GwhcVKiByxLU8tMsqOE3ANoQeI4rRzJHPdkCmfTng1',
		'WDQ0cEhFmtYIzB5q8onCldeJa4xAyrbgUk1V6NiLvGTfjMPuHSsZ39pOK2wXR7',
		'TcbPJ7fYoB1UswM6W4tkSHavR0N5ZFIKLQjdr2enG8gu9DiXOlhCAzExm3pVyq',
		'CIUX9svFNitTpLfc1zJBM2qQ30SZAjhdEmHkGewORbVPDKaxygW5748urloYn6'
	];

	let offsetArray = [];
	const offset = index % template[0].length;
	for (let i = 0; i < template.length; ++i) {
		index = Math.floor(index / template[0].length);
		const o = (offset + index) % template[0].length;
		offsetArray.push(o);
	}

	let resultStr = '';
	for (let i = 0; i < template.length; ++i) {
		resultStr += template[i][offsetArray[i]];
	}

	return resultStr;
};

export { generateRandomSaltString, hashStringWithSalt, generateCookiesString };
