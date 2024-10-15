export const load = async ({ locals, params }) => {
	const { post_id } = params;

	const { dbconn } = locals;

	const query = {
		text: `SELECT p.poster_name, p.poster_email, p.title, p.content, 
            to_char(p.post_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS post_time,
            to_char(p.edit_timestamp, 'YYYY_MM-DD HH24:MI:SS') AS edit_time,
            c.content AS cookies_content 
            FROM post AS p LEFT JOIN cookies AS c ON p.poster_cookies_id = c.id
            WHERE p.id = $1 LIMIT 1`,
		values: [post_id]
	};

	const result = await dbconn.query(query);
	console.log(result);

	if (result.rowCount != 1) {
		return {
			post_id: 'NOT_FOUND'
		};
	}

	const { poster_name, poster_email, title, content, post_time, edit_time, cookies_content } =
		result.rows[0];

	return {
		post: {
			author: poster_name == 'null' ? '无名氏' : poster_name,
			email: poster_email == 'null' ? 'no@name.net' : poster_email,
			title: title == 'null' ? '无标题' : title,
			content,
			post_time,
			edit_time,
			cookies_content: cookies_content == null ? '神秘饼干' : cookies_content
		}
	};
};
