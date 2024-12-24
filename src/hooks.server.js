import { connectToDB } from '$lib/db';

import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';

const db = async ({ event, resolve }) => {
	// 在访问install路由时不连接数据库
	if (event.url.pathname.startsWith('/install')) {
		const response = await resolve(event);
		return response;
	}

	const dbconn = await connectToDB({
		host: PGHOST,
		user: PGUSER,
		pass: PGPASSWORD,
		port: PGPORT,
		database: PGDATABASE
	});
	event.locals = { dbconn };

	const response = await resolve(event);
	dbconn.release();
	return response;
};
export const handle = sequence(db);
