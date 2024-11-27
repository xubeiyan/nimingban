import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';

export const POST = async ({ locals, request }) => {
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

	const {
		sectionId,
		min_post_second: minPostSecond,
		access_type: accessType,
		name,
		url,
		intro
	} = await request.json();

	const searchSectionQuery = {
		text: `SELECT 1 FROM section WHERE id = $1`,
		values: [sectionId]
	};

	const searchSectionResult = await dbconn.query(searchSectionQuery);

	if (searchSectionResult.rowCount != 1) {
		return json({
			type: 'error',
			errorCode: 'NO_SUCH_SECTION'
		});
	}

	const fetchBoardQuery = {
		text: `SELECT 1 FROM board WHERE url_name = $1`,
		values: [url]
	};

	const fetchBoardResult = await dbconn.query(fetchBoardQuery);

	if (fetchBoardResult.rowCount > 0) {
		return json({
			type: 'error',
			errorCode: 'DUPLICATE_BOARD_URL'
		});
	}

	const insertQuery = {
		text: `INSERT INTO board ( 
            id,                 parent_section_id, min_post_second, min_post_timestamp, access_type, name, url_name, intro, "order"
        ) VALUES (
            gen_random_uuid(),  $1,                $2,              now(),              $3,          $4,   $5,       $6,    (SELECT COUNT(*) + 1 FROM board WHERE parent_section_id = $1)
        ) RETURNING id;
        `,
		values: [sectionId, minPostSecond, accessType, name, url, intro]
	};

	const insertResult = await dbconn.query(insertQuery);

	return json({
		type: 'ok',
		boardId: insertResult.rows[0].id
	});
};
