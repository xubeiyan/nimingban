// 获取一条评论
import { json } from '@sveltejs/kit';
import { nullToDefaultString } from '$lib/SendForm/string.js';

export const GET = async ({ params, locals }) => {
	const { comment_id } = params;
	const { dbconn } = locals;

	const query = {
		text: `
            SELECT c.id, c.poster_name, c,poster_email, c.title, c.content, 
            to_char(c.post_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS comment_time,
			to_char(c.edit_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS edit_time,
            cookies.content AS cookies_content
            FROM comment AS c LEFT JOIN cookies ON c.poster_cookies_id = cookies.id
            WHERE c.id = $1 LIMIT 1`,
		values: [comment_id]
	};

	const result = await dbconn.query(query);

	if (result.rowCount == 0) {
		return json({
			type: 'error',
			errorCode: 'INVALID_COMMENT_ID'
		});
	}

	const {
		id,
		poster_name,
		poster_email,
		title,
		content,
		comment_time,
		edit_time,
		cookies_content
	} = result.rows[0];

	return json({
		type: 'ok',
		comment: {
			id,
			poster_name: nullToDefaultString({ type: 'poster_name', value: poster_name }),
			poster_email: nullToDefaultString({ type: 'poster_email', value: poster_email }),
			title: nullToDefaultString({ type: 'title', value: title }),
			content,
			comment_time,
			edit_time,
			cookies_content: cookies_content == null ? '神秘饼干' : cookies_content
		}
	});
};
