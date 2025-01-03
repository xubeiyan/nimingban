import { writable } from 'svelte/store';

export const cookieManageStore = writable({
	username: null,
	cookie: null
});
