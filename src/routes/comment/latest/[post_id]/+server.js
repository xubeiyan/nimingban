import { nullToDefaultString } from '$lib/SendForm/string.js';
import { json } from '@sveltejs/kit';

export const GET = async ({ params, locals }) => {
	const { post_id } = params;
	const { dbconn } = locals;

	// 获取串的评论数
	const COMMENT_LIMIT = 5;

	const countQuery = {
		text: `SELECT COUNT(*) AS row_count FROM comment WHERE belong_post_id = $1`,
		values: [post_id]
	};

	const countResult = await dbconn.query(countQuery);

	const { row_count: rowCount } = countResult.rows[0];

	const query = {
		text: `SELECT * FROM (
            SELECT c.id, c.poster_name, c,poster_email, c.title, c.content, 
            to_char(c.post_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS comment_time,
			to_char(c.edit_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS edit_time,
            cookies.content AS cookies_content
            FROM comment AS c LEFT JOIN cookies ON c.poster_cookies_id = cookies.id
            WHERE c.belong_post_id = $1 
            ORDER BY comment_time DESC LIMIT $2
        ) AS latest_comments ORDER BY comment_time ASC`,
		values: [post_id, COMMENT_LIMIT]
	};

	const result = await dbconn.query(query);
	let comments = [];

	result.rows.forEach((one) => {
		const {
			id,
			poster_name,
			poster_email,
			title,
			content,
			comment_time,
			edit_time,
			cookies_content
		} = one;
		comments.push({
			id,
			poster_name: nullToDefaultString({ type: 'poster_name', value: poster_name }),
			poster_email: nullToDefaultString({ type: 'poster_email', value: poster_email }),
			title: nullToDefaultString({ type: 'title', value: title }),
			content,
			comment_time,
			edit_time,
			cookies_content: cookies_content == null ? '神秘饼干' : cookies_content
		});
	});
	return json({
		rowCount,
		comments
	});
};
