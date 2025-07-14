const userStatusMap = {
	enable: '已启用',
	disable: '已禁用'
};

export const getUserStatusValue = (key) => {
	if (userStatusMap[key] == undefined) {
		return '未知状态';
	}

	return userStatusMap[key];
};

export const avaliableUserStatusKey = () => {
	return Object.keys(userStatusMap);
};

const userTypeMap = {
	admin: '权限猴子',
	user: '一般用户'
};

export const getUserTypeValue = (key) => {
	if (userTypeMap[key] == undefined) {
		return '神秘猴子';
	}

	return userTypeMap[key];
};

// 判断登录是否过期
export const loginAlreadyExpire = (user) => {
	const [_, payload] = user.token.split('.');
	const userInfo = JSON.parse(atob(payload));
	const expireTimeStamp = userInfo.expire;
	const now = Date.now();

	if (expireTimeStamp <= now) {
		return true;
	}
	return false;
}