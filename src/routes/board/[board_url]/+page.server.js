export const load = async ({ locals, params }) => {
	const { board_url } = params;
	const { dbconn } = locals;
	const query = {
		text: `SELECT b.id AS board_id, b.board_name, b.board_intro FROM board AS b WHERE b.board_url_name = $1 LIMIT 1`,
		values: [board_url]
	};
	const result = await dbconn.query(query);

	// TODO: cannot find board error

	const { board_id, board_name, board_intro } = result.rows[0];

	let limit = 20;
	let offset = 0;
	const post_query = {
		text: `
			SELECT p.id, p.title, p.email, p.author, p.content 
      FROM posts 
			AS p WHERE p.belong_board_id = $1 
			LIMIT $2 OFFSET $3
		`,
		values: [board_id, limit, offset]
	};

	const post_result = await dbconn.query(post_query);
	let posts = [];
	if (post_result.rows != undefined && post_result.rows.length != 0) {
		post_result.rows.forEach((one) => {
			posts.push({
				id: one.id,
				title: one.title,
				email: one.email,
				author: one.author,
				content: one.content
			});
		});
	}

	return {
		board_id,
		board_name,
		board_intro,
		posts
	};
};
