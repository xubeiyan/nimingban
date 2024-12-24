import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { connectToDB } from '$lib/db';
import { paramsTemplate } from '$lib/Install/siteParams.js';

export const POST = async ({ request }) => {
	const dbconn = await connectToDB({
		host: PGHOST,
		user: PGUSER,
		pass: PGPASSWORD,
		port: PGPORT,
		database: PGDATABASE
	});

	const { name, value } = await request.json();

	const nameArr = Object.keys(paramsTemplate);

	if (!nameArr.includes(name)) {
		return json({
			type: 'error',
			errorCode: 'NAME_INVALID'
		});
	}

	if (['', undefined, null].includes(value)) {
		return json({
			type: 'error',
			errorCode: 'VALUE_INVALID'
		});
	}

	const searchQuery = {
		text: 'SELECT 1 FROM site_settings WHERE "name" = $1',
		values: [name]
	};

	const searchResult = await dbconn.query(searchQuery);

	let updateOrInsertQuery = {
		text: `UPDATE site_settings SET value = $1 WHERE "name" = $2`,
		values: [value, name]
	};
	// 没有则插入
	if (searchResult.rowCount == 0) {
		const { data_type, description } = paramsTemplate[name];

		updateOrInsertQuery = {
			text: `INSERT INTO site_settings 
            ("name", data_type, value, description) VALUES
            ($1, $2, $3, $4)
            `,
			values: [name, data_type, value, description]
		};
	}

	await dbconn.query(updateOrInsertQuery);

	return json({
		type: 'ok'
	});
};
