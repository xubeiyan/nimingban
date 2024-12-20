import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { connectToDB } from '$lib/db';

export const GET = async () => {
	const dbconn = await connectToDB({
		host: PGHOST,
		user: PGUSER,
		pass: PGPASSWORD,
		port: PGPORT,
		database: PGDATABASE
	});

	const getConfigQuery = `SELECT "name", data_type, value FROM site_settings`;

	const getConfigResult = await dbconn.query(getConfigQuery);

	const configs = getConfigResult.rows.map((r) => {
		let value = r.value;
		if (r.data_type == 'number') {
			value = Number(value);
		} else if (r.data_type == 'boolean') {
			value = Boolean(value);
		}

		return {
			name: r.name,
			value
		};
	});

	return json({
		type: 'ok',
		configs
	});
};
