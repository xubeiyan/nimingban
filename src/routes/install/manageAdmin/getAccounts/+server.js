import { json } from '@sveltejs/kit';
import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { connectToDB } from '$lib/db';

export const GET = async () => {
	const dbconn = await connectToDB({
		host: PGHOST,
		user: PGUSER,
		pass: PGPASSWORD,
		port: PGPORT,
		database: PGDATABASE
	});

	const result = await dbconn.query(`
        SELECT id, username, 
        to_char(create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS create_time
        FROM "user" WHERE "type" = 'admin'
    `);

	const users = result.rows.map((r) => ({
		id: r.id,
		username: r.username,
		create_time: r.create_time
	}));

	return json({
		type: 'ok',
		users
	});
};
