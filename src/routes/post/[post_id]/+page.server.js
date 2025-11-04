import { nullToDefaultString } from '$lib/SendForm/string.js';

export const load = async ({ locals, params }) => {
	const { post_id } = params;

	const { dbconn } = locals;

	const query = {
		text: `SELECT p.id, p.status, p.poster_name, p.poster_email, p.title, p.content, 
            to_char(p.post_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS post_time,
            to_char(p.edit_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS edit_time,
            c.content AS cookies_content 
            FROM post AS p LEFT JOIN cookies AS c ON p.poster_cookies_id = c.id
            WHERE p.id = $1 LIMIT 1`,
		values: [post_id]
	};

	const result = await dbconn.query(query);

	if (result.rowCount != 1) {
		return {
			post_id: 'NOT_FOUND'
		};
	}

	const {
		id,
		status,
		poster_name: name,
		poster_email: email,
		title,
		content,
		post_time,
		edit_time,
		cookies_content
	} = result.rows[0];

	return {
		post: {
			id,
			status,
			name: nullToDefaultString({ type: 'poster_name', value: name }),
			email: nullToDefaultString({ type: 'poster_email', value: email }),
			title: nullToDefaultString({ type: 'title', value: title }),
			content,
			post_time,
			edit_time,
			cookies_content: cookies_content == null ? '神秘饼干' : cookies_content
		}
	};
};
