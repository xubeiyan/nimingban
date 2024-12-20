import { json } from '@sveltejs/kit';
import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { connectToDB } from '$lib/db';

export const GET = async ({ params }) => {
	const { id } = params;

	const dbconn = await connectToDB({
		host: PGHOST,
		user: PGUSER,
		pass: PGPASSWORD,
		port: PGPORT,
		database: PGDATABASE
	});

	const query = {
		text: `DELETE FROM "user" WHERE id = $1`,
		values: [id]
	};

	await dbconn.query(query);

	return json({
		type: 'ok'
	});
};
