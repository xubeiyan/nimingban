import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { connectToDB } from '$lib/db';

export const load = async () => {
	try {
		const dbconn = await connectToDB({
			host: PGHOST,
			user: PGUSER,
			pass: PGPASSWORD,
			port: PGPORT,
			database: PGDATABASE
		});

		const result = await dbconn.query(
			`SELECT value FROM site_settings WHERE "name" = 'config_complete' LIMIT 1`
		);

		if (result.rowCount != 1 || result.rows[0].value != 'true') {
			return {
				config_complete: false,
				db: {
					host: PGHOST,
					user: PGUSER,
					database: PGDATABASE,
					password: PGPASSWORD,
					port: PGPORT
				}
			};
		}

		return {
			config_complete: true
		};
	} catch (e) {
		let errorCode = '';
		if (e.code == 'ECONNREFUSED') {
			errorCode = 'SERVER_REFUSED_CONNECTION';
		} else if (e.routine == 'auth_failed') {
			errorCode = 'DATABASE_AUTH_FAILED';
		}

		return json({
			type: 'error',
			errorCode
		});
	}
};
