import { json, text } from '@sveltejs/kit';

export async function POST({ request }) {
	const { username, password } = await request.json();
	return json({ username, password });
}
