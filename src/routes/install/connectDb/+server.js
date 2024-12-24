import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { connectToDB } from '$lib/db';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	try {
		await connectToDB({
			host: PGHOST,
			user: PGUSER,
			pass: PGPASSWORD,
			port: PGPORT,
			database: PGDATABASE
		});
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

	return json({
		type: 'ok'
	});
};
