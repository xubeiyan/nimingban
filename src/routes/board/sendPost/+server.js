import { json } from '@sveltejs/kit';
import { writeFile } from 'fs/promises';

import { randomUUID } from 'node:crypto';

import { JWTAuth } from '$lib/auth.js';

const MAX_UPLOAD_IMAGE_COUNT = 5;
const SINGLE_IMAGE_SIZE = 2 * 1024 * 1024; // 不超过2MiB

const CONTENT_MIN_LENGTH = 10;

const ALLOW_IMAGE_TYPE = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif'];

// 图片上传路径，如果使用相对路径，则是从packages.json开始计算
const IMAGE_UPLOAD_PATH = './static/images';
// 图片引用路径
const IMAGE_URL_PATH = '/images';

export async function POST({ locals, request }) {
	const authRes = JWTAuth(request);

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	const formData = await request.formData();
	const uploadImages = formData?.getAll('image');
	const board = formData?.get('board');
	const name = formData?.get('name');
	const email = formData?.get('email');
	const title = formData?.get('title');
	const content = formData?.get('content');
	const cookies = formData?.get('cookies');

	/* 
	// 未提供cookies字段
	*/
	if (cookies == null) {
		return json({
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: null
		});
	}

	// 验证 cookies
	const cookie_query = {
		text: `SELECT belong_user_id FROM cookies WHERE content = $1 LIMIT 1`,
		values: [cookies]
	};

	const { dbconn } = locals;

	const cookies_result = await dbconn.query(cookie_query);

	if (cookies_result.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: 'c n e' // cookies not exist
		});
	}

	const belong_user_id = cookies_result.rows[0].belong_user_id;

	const user_query = {
		text: `SELECT status, username FROM "user" WHERE id = $1 LIMIT 1`,
		values: [belong_user_id]
	};

	const user_result = await dbconn.query(user_query);

	if (user_result.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: 'u n e' // user not exist
		})
	}

	const { status, username } = user_result.rows[0];

	if (status != 'enable') {
		return json({
			type: 'error',
			errorCode: 'USER_NOT_ENABLE'
		})
	}

	if (username != authRes.username) {
		return json({
			type: 'error',
			errorCode: 'WRONG_COOKIES',
			extra: 'u c m', // user cookies mismatch
		})
	}

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
	// 图片格式不符合
	{
		type: "error",
		errorCode: "IMAGE_FORMAT_NOT_ALLOW",
		errorDetal: {
			filenames: ['not_allowed_format.bmp']
		}
	}
	*/
	const wrongFormats = [];

	for (let image of uploadImages) {
		if (!ALLOW_IMAGE_TYPE.includes(image.type)) {
			wrongFormats.push(image.name);
		}
	}

	if (wrongFormats.length > 0) {
		return json({
			type: 'error',
			errorCode: 'IMAGE_FORMAT_NOT_ALLOW',
			errorDetail: {
				filenames: wrongFormats
			}
		});
	}

	/*
    // 超出了图片文件大小
    {
        type: "error",
        errorCode: "IMAGE_OVERSIZE",
		errorDetail: {
			filenames: ['oversize.jpg']
		}
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

	// 上传图片，使用uuid名称作为文件名
	const ext = {
		'image/png': 'png',
		'image/jpeg': 'jpg',
		'image/gif': 'gif',
		'image/webp': 'webp',
		'image/avif': 'avif'
	};

	const uploaded = [];

	uploadImages.map(async (one) => {
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

	// 写入数据库
	// 查找board是否存在

	const boardSearchQuery = {
		text: `SELECT id FROM board WHERE url_name = $1 LIMIT 1`,
		values: [board]
	};
	const boardSearchResult = await dbconn.query(boardSearchQuery);

	if (boardSearchResult.rowCount != 1) {
		return json({
			type: 'error',
			errorCode: 'BOARD_NOT_EXIST'
		});
	}

	const board_id = boardSearchResult.rows[0].id;

	const boardInsertQuery = {
		text: `INSERT INTO post (
			id, 				poster_name, 	poster_email, 	title, 	content,	poster_cookies_id,						post_timestamp, belong_board_id
		) VALUES (
		 	gen_random_uuid(),	$1,				$2,				$3,		$4,			'',	now(),			$5
		) RETURNING id`,
		values: [name, email, title, replaceImageUrlContent, board_id]
	};

	const boardInsertResult = await dbconn.query(boardInsertQuery);

	const post_id = boardInsertResult.rows[0].id;

	// 如果有图片，则需插入post_comment_image表
	uploaded.forEach(async (one) => {
		const imageInsertQuery = {
			text: `INSERT INTO post_comment_image (
				id, 				image_type, exist_type, post_id
			) VALUES (
				gen_random_uuid(), 	$1,			'exist',	$2
			)`,
			values: [one.type, post_id]
		};

		await dbconn.query(imageInsertQuery);
	});

	return json({
		type: 'ok'
	});
}
