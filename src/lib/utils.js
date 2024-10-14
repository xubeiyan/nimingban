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
const generateCookiesString = (index) => {
	const template = [
		'ZGuNHcDwpsObhYegLBylm8rTan34xMAiqKdVJXS6W2RCQ5EtzkvofPj79FIU01',
		'xcVoaGAdHUMK3RJjEvNS8IsXw2hOrY75npDZWlu0kbt6C1qLmeFz9TfBgQiyP4',
		'DF0vaXlW7u5Y2ZjpSb96GwhcVKiByxLU8tMsqOE3ANoQeI4rRzJHPdkCmfTng1',
		'WDQ0cEhFmtYIzB5q8onCldeJa4xAyrbgUk1V6NiLvGTfjMPuHSsZ39pOK2wXR7',
		'TcbPJ7fYoB1UswM6W4tkSHavR0N5ZFIKLQjdr2enG8gu9DiXOlhCAzExm3pVyq',
		'CIUX9svFNitTpLfc1zJBM2qQ30SZAjhdEmHkGewORbVPDKaxygW5748urloYn6'
	];

	let templateIndex = [];
	
	for (let i = template.length - 1; i >= 0; i--) {
		const len = template[i].length;
		const idx = index % len;
		templateIndex.unshift(template[i][idx]);
		index = Math.floor(index / len);
	}

	return templateIndex.join('');
};

export { generateRandomSaltString, hashStringWithSalt, generateCookiesString };
