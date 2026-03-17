import { writable } from 'svelte/store';

export const boardStore = writable({
	boardUrl: null,
	from: 0,
	total: 0,
	comment_from: 0,
	comment_total: 0,
	upload_image_max_size: 5,
	upload_image_max_count: 2048
});
