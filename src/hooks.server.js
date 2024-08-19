import { connectToDB } from "$lib/db";

import { PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT } from '$env/static/private';

export async function handle({ event, resolve }) {
    const dbconn = await connectToDB({ host: PGHOST, user: PGUSER, pass: PGPASSWORD, port: PGPORT, database: PGDATABASE });
    event.locals = { dbconn };

    const response = await resolve(event);
    dbconn.release();
    return response;
}