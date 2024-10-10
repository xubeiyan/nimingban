import { json } from '@sveltejs/kit';

export async function GET({ locals, url }) {
	const board_id = url.searchParams.get('board_id');

	if (board_id == undefined) {
		// 没有board_id则报错
		return json({
			type: 'error',
			errorCode: 'NO_BOARD_ID'
		});
	}

	const { dbconn } = locals;

	/* 
	最后一行SQL的 AND 不使用 WHERE 的原因在于后者会在 JOIN 之后再应用 WHERE
	*/
	const query = {
		text: `
		SELECT p.id, p.poster_name, p.poster_email, p.title, p.content, 
		to_char(p.post_timestamp, 'YYYY-MM-DD HH:MI:SS') AS post_time, 
		c.content AS cookies_content
		FROM post AS p LEFT JOIN cookies AS c ON p.poster_cookies_id = c.id
		AND p.belong_board_id = $1 ORDER BY post_time DESC`,
		values: [board_id]
	};

	const posts_result = await dbconn.query(query);

	let posts = [];

	if (posts_result.rows != undefined && posts_result.rows.length != 0) {
		posts_result.rows.forEach((one) => {
			posts.push({
				id: one.id,
				author: one.poster_name == 'null' ? '无名氏' : one.poster_name,
				email: one.poster_email == 'null' ? 'no@name.net' : one.poster_email,
				title: one.title == 'null' ? '无标题' : one.title,
				content: one.content,
				post_time: one.post_time,
				cookies_content: one.cookies_content == null ? '神秘饼干' : one.cookies_content
			});
		});
	}

	return json(posts);
}
