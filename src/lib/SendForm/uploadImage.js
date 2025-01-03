// 从配置文件读取的上传地址
import { IMAGE_UPLOAD_PATH } from '$env/static/private';

const ext = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/gif': 'gif',
	'image/webp': 'webp',
	'image/avif': 'avif'
};

// 支持的文件格式
export const supportImageExt = Object.fromEntries(Object.entries(ext).map(([k, v]) => [v, k]));

// 图片引用路径
const IMAGE_URL_PATH = '/images';

import { randomUUID } from 'node:crypto';

import { writeFile } from 'fs/promises';

export const uploadImages = (content, toUploadImages) => {
	if (toUploadImages == undefined) {
		return { replaceImageUrlContent: content, uploaded: [] };
	}
	// 上传图片，使用uuid名称作为文件名
	const uploaded = [];

	toUploadImages.map(async (one) => {
		const filename = randomUUID().replaceAll('-', '');
		const fullname = `${filename}.${ext[one.type]}`;
		uploaded.push({ upload: 'success', name: fullname, type: one.type });
		await writeFile(`${IMAGE_UPLOAD_PATH}/${fullname}`, one.stream());
	});

	// 替换内容中的图片链接
	let replaceImageUrlContent = content;

	uploaded.forEach((one, index) => {
		const regex = new RegExp(`/TEMPFOLDER/${index + 1}`, 'g');
		replaceImageUrlContent = replaceImageUrlContent.replaceAll(
			regex,
			`${IMAGE_URL_PATH}/${one.name}`
		);
	});

	// 如果没有图片而有图片链接则替换为一张默认图片
	replaceImageUrlContent = replaceImageUrlContent.replaceAll(
		/\/TEMPFOLDER\/\d+/g,
		'/miss_attach.png'
	);

	return { replaceImageUrlContent, uploaded };
};
