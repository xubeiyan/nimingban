import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';

export const GET = async ({ params, locals, request }) => {
	const authRes = JWTAuth(request);

	// 认证错误则返回
	if (authRes.type != 'ok') {
		return json(authRes);
	}

	// 不是admin不允许操作
	if (authRes.userType != 'admin') {
		return json({
			type: 'error',
			errorCode: 'OPERATION_NOT_ALLOWED'
		});
	}

	const { dbconn } = locals;

	const { id } = params;

	const boardSearchQuery = {
		text: `SELECT COUNT(*) AS count FROM board WHERE parent_section_id = $1`,
		values: [id]
	};

	const postSearchResult = await dbconn.query(boardSearchQuery);

	if (postSearchResult.rows[0].count > 0) {
		return json({
			type: 'error',
			errorCode: 'SECTION_EXIST_BOARD'
		});
	}

	const deleteSectionQuery = {
		text: `DELETE FROM section WHERE id = $1`,
		values: [id]
	};

	await dbconn.query(deleteSectionQuery);

	return json({
		type: 'ok'
	});
};
