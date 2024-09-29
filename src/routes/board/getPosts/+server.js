import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	const { dbconn } = locals;
	return json();
}
