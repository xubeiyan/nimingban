import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const formData = await request.formData();
    const uploadImages = formData?.getAll('image');
    const name = formData?.get('name');
    const email = formData?.get('email');
    const title = formData?.get('title');
    const content = formData?.get('content');

    console.log(name, email, title, content, uploadImages);


    return json({ name, email, title, content })
}