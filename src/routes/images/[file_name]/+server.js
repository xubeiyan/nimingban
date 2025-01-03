import { readFile } from 'fs/promises';
import { error } from '@sveltejs/kit';

import { supportImageExt } from '$lib/SendForm/uploadImage.js';

// 从配置文件读取的上传地址
import { IMAGE_UPLOAD_PATH } from '$env/static/private';

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
