import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';

export const GET = async ({ params, request, locals }) => {
	const { dbconn } = locals;
	const { secret: jwt } = await getJWTSecretDB(dbconn);
	const authRes = JWTAuth(request, jwt);

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	// 不是admin不允许操作
	if (authRes.userType != 'admin') {
		return json({
			type: 'error',
			errorCode: 'OPERATION_NOT_ALLOWED'
		});
	}

	const { id } = params;

	const deletePostQuery = {
		text: `DELETE FROM post WHERE status = 'hidden' AND id = $1`,
		values: [id]
	};

	const deletePostResult = await dbconn.query(deletePostQuery);

	const postCount = deletePostResult.rowCount;
	if (postCount != 1) {
		return json({
			type: 'error',
			errorCode: 'SUCH_POST_NOT_EXIST'
		});
	}

  // 删除串的图像
  const deletePostImagesQuery = {
    text: `UPDATE post_comment_image SET exist_type = 'delete' WHERE post_id = $1`,
    values: [id],
  }

  await dbconn.query(deletePostImagesQuery);

  // 删除回复时返回它的id
	const deleteCommentQuery = {
		text: `DELETE FROM comment WHERE belong_post_id = $1 RETURNING id`,
		values: [id]
	};

	const deleteCommentResult = await dbconn.query(deleteCommentQuery);

  // 增加删除帖子包含的图像的操作
  const commentIds = deleteCommentResult.rows.filter(row => row.id).map(one => one.id);

  const deleteCommentsImagesQuery = {
    text: `UPDATE post_comment_image SET exist_type = 'delete' WHERE post_id = ANY($1::uuid[])`,
    values: [commentIds],
  };

  await dbconn.query(deleteCommentsImagesQuery);

	return json({
		type: 'ok',
		postCount,
		commentCount: deleteCommentResult.rowCount
	});
};
