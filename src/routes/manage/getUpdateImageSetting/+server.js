import { json } from '@sveltejs/kit';
import { MAX_SINGLE_IMAGE_SIZE, MAX_UPLOAD_IMAGE_COUNT } from '$env/static/private';

export const GET = async ({ request }) => {
    return json({
        type: 'ok',
        settings: {
            upload_image_max_size: Number(MAX_SINGLE_IMAGE_SIZE),
            upload_image_max_count: Number(MAX_UPLOAD_IMAGE_COUNT),
        }
    });
};
