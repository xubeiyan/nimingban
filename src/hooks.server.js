import { connectToDB } from '$lib/db';

import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';

import { dev } from '$app/environment';

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

// 移除调试时的Chrome的对 /.well-known/appspecific/com.chrome.devtools.json 的傻缺请求
const shutUpDevTools = ({event, resolve}) => {
	if (dev && event.url.pathname === '/.well-known/appspecific/com.chrome.devtools.json') {
		return new Response(undefined, { status: 404 });
	}
	return resolve(event);
}

export const handle = sequence(db, shutUpDevTools);
