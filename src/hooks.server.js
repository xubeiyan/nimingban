import { connectToDB } from "$lib/db";

export async function handle({ event, resolve }) {
    const dbconn = await connectToDB();
    event.locals = { dbconn };

    const response = await resolve(event);
    dbconn.release();
    return response;
}