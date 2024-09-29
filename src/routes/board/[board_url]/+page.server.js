export const load = async ({ locals, params }) => {
	const { board_url } = params;
	const { dbconn } = locals;
	const query = {
		text: `SELECT b.id AS board_id, b.name, b.intro FROM board AS b WHERE b.url_name = $1 LIMIT 1`,
		values: [board_url]
	};
	const result = await dbconn.query(query);

	// TODO: cannot find board error

	const { board_id, name, intro } = result.rows[0];

	let limit = 20;
	let offset = 0;
	const post_query = {
		text: `
			SELECT p.id, p.title, p.poster_email, p.poster_name, p.content,
			to_char(p.post_timestamp, 'YYYY-MM-DD HH:MI:SS') AS post_time FROM post 
			AS p WHERE p.belong_board_id = $1 
			LIMIT $2 OFFSET $3
		`,
		values: [board_id, limit, offset]
	};

	const post_result = await dbconn.query(post_query);
	console.log(post_query);
	let posts = [];
	if (post_result.rows != undefined && post_result.rows.length != 0) {
		post_result.rows.forEach((one) => {
			posts.push({
				id: one.id,
				title: one.title == 'null' ? '无标题' : one.title,
				email: one.poster_email == 'null' ? 'no@name.net' : one.poster_email,
				author: one.poster_name == 'null' ? '无名氏' : one.poster_name,
				content: one.content,
				cookies_content: one.cookies_content,
				post_time: one.post_time,
			});
		});
	}

	return {
		board_id,
		name,
		intro,
		posts,
	};
};
