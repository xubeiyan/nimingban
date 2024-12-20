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

	const getCompleteQuery = `SELECT value FROM site_settings WHERE "name" = 'config_complete'`;

	const getCompleteResult = await dbconn.query(getCompleteQuery);

	let insertOrUpdateQuery = `UPDATE site_settings SET value = 'true' WHERE "name" = 'config_complete'`;

	if (getCompleteResult.rowCount == 0) {
		insertOrUpdateQuery = `INSERT INTO site_settings 
            (name,              data_type, value,  description) VALUES
            ('config_complete', 'boolean', 'true', '匿名版配置是否完成')`;
	}

	await dbconn.query(insertOrUpdateQuery);

	return json({
		type: 'ok'
	});
};
