import { json } from '@sveltejs/kit';

export const GET = async ({ locals, params, url }) => {
	const { dbconn } = locals;
	const { post_id } = params;

	const GET_SIZE = 20;

	let from = url.searchParams.get('from');
	if (from == undefined || isNaN(from)) {
		from = 0;
	}

	// 获取此串回复的数量
	const count_query = {
		text: `SELECT CAST(COUNT(*) AS INTEGER) AS total_comment
		FROM comment WHERE belong_post_id = $1`,
		values: [post_id]
	};

	const countResult = await dbconn.query(count_query);

	const { total_comment: totalComment } = countResult.rows[0];

	const commentSearchQuery = {
		text: `SELECT c.id, c.poster_name, c,poster_email, c.title, c.content, 
        to_char(c.post_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS comment_time,
		to_char(c.edit_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS edit_time,
        cookies.content AS cookies_content
        FROM comment AS c LEFT JOIN cookies ON c.poster_cookies_id = cookies.id
        WHERE c.belong_post_id = $1 
        ORDER BY comment_time ASC LIMIT $2 OFFSET $3
        `,
		values: [post_id, GET_SIZE, from]
	};

	const commentSearchResult = await dbconn.query(commentSearchQuery);

	let comments = [];

	if (commentSearchResult.rowCount > 0) {
		commentSearchResult.rows.forEach((one) => {
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
				poster_name: poster_name == 'null' ? '无名氏' : poster_name,
				poster_email: poster_email == 'null' ? 'no@name.net' : poster_email,
				title: title == 'null' ? '无标题' : title,
				content,
				comment_time,
				edit_time,
				cookies_content: cookies_content == null ? '神秘饼干' : cookies_content
			});
		});
	}

	return json({
		getSize: GET_SIZE,
		from,
		comments,
		totalComment
	});
};
