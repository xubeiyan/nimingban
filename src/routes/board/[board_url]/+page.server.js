export const load = async ({ locals, params }) => {
	const { board_url } = params;
	const { dbconn } = locals;
	const query = {
		text: `SELECT b.name, b.intro FROM board AS b WHERE b.url_name = $1 LIMIT 1`,
		values: [board_url]
	};
	const result = await dbconn.query(query);

	// TODO: cannot find board error
	if (result.rowCount == 0) {
		return {
			type: 'error',
			errorCode: 'NO_SUCH_BOARD'
		};
	}

	const { name, intro } = result.rows[0];

	return {
		type: 'ok',
		name,
		intro,
		posts: []
	};
};
