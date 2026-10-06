// 从配置文件读取的上传地址
import { IMAGE_UPLOAD_PATH } from '$env/static/private';

import { randomUUID } from 'node:crypto';
import { writeFile } from 'fs/promises';

import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth.js';
import { validCookies, validateImages } from '$lib/SendForm/validation.js';

const ext = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif'
};

// 图片引用路径
const IMAGE_URL_PATH = '/images';
// 上传图片为临时文件
export async function POST({ locals, request }) {
  const { dbconn } = locals;
  const { secret: jwt } = await getJWTSecretDB(dbconn);
  const authRes = JWTAuth(request, jwt);

  // 认证错误则返回
  if (authRes.type != 'ok') {
    return json(authRes);
  }

  const formData = await request.formData();
  const toUploadImage = formData?.get('file');

  const imageID = randomUUID();
  const filename = imageID.replaceAll('-', '');
  const fileExt = ext[toUploadImage.type] || 'error';

  if (fileExt == 'error') {
    return json({
      type: "error",
      errorCode: "NOT_SUPPORT_IMAGE_FORMAT",
    });
  }

  const fullname = `${filename}.${fileExt}`;
  const path = `${IMAGE_URL_PATH}/${fullname}`;
  const filePath = `${IMAGE_UPLOAD_PATH}/${fullname}`;
  // 使用 arrayBuffer 代替 stream
  const buffer = Buffer.from(await toUploadImage.arrayBuffer());
  await writeFile(filePath, buffer);

  const imageInsertQuery = {
    text: `INSERT INTO
      post_comment_image 
      (id, image_type, exist_type, fullname) 
    VALUES 
      ($1, $2, 'exist', $3)`,
    values: [imageID, toUploadImage.type, fullname],
  };

  await dbconn.query(imageInsertQuery);

  return json({
    type: "ok",
    path: path,
    imageID: imageID,
  });
}
