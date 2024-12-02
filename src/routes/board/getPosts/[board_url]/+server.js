import { json } from '@sveltejs/kit';
import { nullToDefaultString } from '$lib/SendForm/string.js';
import { JWTAuth } from '$lib/auth';

export async function GET({ locals, params, url, request }) {
	const { board_url } = params;

	const GET_SIZE = 10;

	let from = url.searchParams.get('from');
	if (from == undefined) {
		from = 0;
	}

	let sql = `SELECT p.id, p.status, p.poster_name, p.poster_email, p.title, p.content,
		to_char(p.post_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS post_time, 
		to_char(p.edit_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS edit_time,
		c.content AS cookies_content
		FROM post AS p LEFT JOIN cookies AS c ON p.poster_cookies_id = c.id
		WHERE p.status IN ('repliable', 'readonly') AND p.belong_board_id = $1 
		ORDER BY post_time DESC LIMIT $2 OFFSET $3`;

	// 如果有认证字段
	if (request.headers.get('Authorization') != undefined) {
		const authRes = JWTAuth(request);

		if (authRes.userType == 'admin') {
			sql = `SELECT p.id, p.status, p.poster_name, p.poster_email, p.title, p.content,
			to_char(p.post_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS post_time, 
			to_char(p.edit_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS edit_time,
			c.content AS cookies_content
			FROM post AS p LEFT JOIN cookies AS c ON p.poster_cookies_id = c.id WHERE
			p.belong_board_id = $1 
			ORDER BY post_time DESC LIMIT $2 OFFSET $3`;
		}
	}

	const { dbconn } = locals;

	// 获取此区帖子的数量
	const count_query = {
		text: `SELECT CAST(COUNT(*) AS INTEGER) AS total_post, board.id AS board_id
		FROM post RIGHT JOIN board ON 
		board.id = post.belong_board_id WHERE board.url_name = $1 
		GROUP BY board.id`,
		values: [board_url]
	};

	const count_result = await dbconn.query(count_query);

	const { total_post: totalPost, board_id } = count_result.rows[0];

	// 查询对应帖子
	const query = {
		text: `${sql}`,
		values: [board_id, GET_SIZE, from]
	};

	const posts_result = await dbconn.query(query);

	let posts = [];

	if (posts_result.rowCount > 0) {
		posts_result.rows.forEach((one) => {
			posts.push({
				id: one.id,
				status: one.status,
				author: nullToDefaultString({ type: 'poster_name', value: one.poster_name }),
				email: nullToDefaultString({ type: 'poster_email', value: one.poster_email }),
				title: nullToDefaultString({ type: 'title', value: one.title }),
				content: one.content,
				post_time: one.post_time,
				edit_time: one.edit_time,
				comments: 'fetching',
				cookies_content: one.cookies_content == null ? '神秘饼干' : one.cookies_content
			});
		});
	}

	return json({
		getSize: GET_SIZE,
		from: Number(from),
		totalPost,
		posts
	});
}
