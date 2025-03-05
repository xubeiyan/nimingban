import { writable } from 'svelte/store';

export const userStore = writable({
	username: null,
	type: null,
	token: null,
	cookies: [],
	usingCookie: null,
});
