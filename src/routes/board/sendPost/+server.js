import { json } from '@sveltejs/kit';

const MAX_UPLOAD_IMAGE_COUNT = 5;

export async function POST({ request }) {
    const formData = await request.formData();
    const uploadImages = formData?.getAll('image');
    const name = formData?.get('name');
    const email = formData?.get('email');
    const title = formData?.get('title');
    const content = formData?.get('content');

    /*
    // 超出了最大图片上传数
    {
        type: "error",
        errorCode: "BEYOND_MAX_UPLAD_IMAGE_COUNT"
    }
    */
    if (uploadImages.length > MAX_UPLOAD_IMAGE_COUNT) {
        return json({
            type: "error",
            errorCode: "BEYOND_MAX_UPLAD_IMAGE_COUNT"
        });
    }

    return json({ name, email, title, content })
}