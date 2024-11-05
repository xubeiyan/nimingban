// 图片上传路径，如果使用相对路径，则是从packages.json开始计算
const IMAGE_UPLOAD_PATH = './static/images';
// 图片引用路径
const IMAGE_URL_PATH = '/images';

import { randomUUID } from 'node:crypto';

import { writeFile } from 'fs/promises';

export const uploadImages = (content, toUploadImages) => {
	if (toUploadImages == undefined) {
		return { replaceImageUrlContent: content, uploaded: [] };
	}
	// 上传图片，使用uuid名称作为文件名
	const ext = {
		'image/png': 'png',
		'image/jpeg': 'jpg',
		'image/gif': 'gif',
		'image/webp': 'webp',
		'image/avif': 'avif'
	};
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
