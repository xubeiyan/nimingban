import { json } from '@sveltejs/kit';

export const GET = async ({ locals, params }) => {
	const { id } = params;

	const uuid = id.split('_')[1];

	let queryText = `SELECT fullname FROM post_comment_image WHERE post_id = $1 LIMIT 10`;

	const { dbconn } = locals;
	const query = {
		text: queryText,
		values: [uuid]
	};
	const result = await dbconn.query(query);

	return json({
		type: 'ok',
		images: result.rows.map((r) => r.fullname)
	});
};
