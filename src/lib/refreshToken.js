// 刷新JWT的剩余时间阈值
const REFRESH_TIME_THRESHOLD = 20 * 60 * 1000;
import { userStore } from '../store/userStore';

export const refreshToken = (token) => {
	if (token.split('.').length != 3) return;
	const base64Payload = token.split('.')[1];
	const payloadOriginStr = atob(base64Payload);
	const payload = JSON.parse(payloadOriginStr);

	const timestamp = new Date().getTime();
	const leftMisec = payload.expire - timestamp;

	// 时间小于0或者大于阈值则什么都不做
	if (leftMisec < 0 || leftMisec > REFRESH_TIME_THRESHOLD) {
        console.log(`离 token 过期还有 ${leftMisec} 毫秒，未刷新`)
		return;
	}

	fetch('/user/refreshJWT', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
		.then((r) => r.json())
		.then((res) => {
			if (res.type == 'ok') {
				userStore.update((u) => ({
					token: res.token,
					...u
				}));

				const storage = window.localStorage.getItem('user');
				if (storage == undefined) return;

				const obj = JSON.parse(storage);

				window.localStorage.setItem(
					'user',
					JSON.stringify({
						...obj,
						token: res.token
					})
				);
			}
		});
};
