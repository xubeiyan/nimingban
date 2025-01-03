import { dev } from '$app/environment';
import { readFile } from 'fs/promises';
import { error } from '@sveltejs/kit';

import { supportImageExt } from '$lib/SendForm/uploadImage.js';

// 1. 从配置文件读取的上传地址
import { DEFAULT_IMAGE_UPLOAD_PATH } from '$env/static/private';

// 2. 默认上传地址
let IMAGE_UPLOAD_PATH = './static/images';

// dev模式下使用2，prod模式下使用1
if (!dev) {
	IMAGE_UPLOAD_PATH = DEFAULT_IMAGE_UPLOAD_PATH;
}

export const GET = async ({ params }) => {
	const { file_name } = params;

	const fullPath = `${IMAGE_UPLOAD_PATH}/${file_name}`;

	const ext = file_name.split('.').at(-1);

	let mimeType = 'image/*';
	if (supportImageExt[ext] !== undefined) {
		mimeType = supportImageExt[ext];
	}

	try {
		const file_content = await readFile(fullPath);

		return new Response(file_content, {
			headers: {
				'Content-Type': mimeType
			}
		});
	} catch (e) {
		error(404, {
			message: `${file_name} not found`
		});
	}
};
