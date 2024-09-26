import { json } from '@sveltejs/kit';

const MAX_UPLOAD_IMAGE_COUNT = 5;
const SINGLE_IMAGE_SIZE = 2 * 1024 * 1024; // 不超过2MiB

const CONTENT_MIN_LENGTH = 10;

export async function POST({ request }) {
	const formData = await request.formData();
	const uploadImages = formData?.getAll('image');
	const name = formData?.get('name');
	const email = formData?.get('email');
	const title = formData?.get('title');
	const content = formData?.get('content');

	/*
    // 超出了最大图片上传数
    {
        type: "error",
        errorCode: "BEYOND_MAX_UPLAD_IMAGE_COUNT"
    }
    */
	if (uploadImages.length > MAX_UPLOAD_IMAGE_COUNT) {
		return json({
			type: 'error',
			errorCode: 'BEYOND_MAX_UPLAD_IMAGE_COUNT'
		});
	}

	/*
    // 超出了图片文件大小
    {
        type: "error",
        errorCode: "IMAGE_OVERSIZE"
    }
     */
	const oversizes = [];

	for (let image of uploadImages) {
		if (image.size > SINGLE_IMAGE_SIZE) {
			oversizes.push({
				name: image.name
			});
		}
	}

	if (oversizes.length > 0) {
		let namesArray = [];
		oversizes.forEach((one) => {
			namesArray.push(one.name);
		});
		return json({
			type: 'error',
			errorCode: 'IMAGE_OVERSIZE',
			errorDetail: {
				filenames: namesArray
			}
		});
	}
	/*
    // 正文内容太少
    {
        type: "error",
        errorCode: "CONTENT_LENGTH_TOO_SHORT"
    }
    */
	if (content == null || content.length < CONTENT_MIN_LENGTH) {
		return json({
			type: 'error',
			errorCode: 'CONTENT_LENGTH_TOO_SHORT'
		});
	}

	return json({
		type: 'ok'
	});
}
