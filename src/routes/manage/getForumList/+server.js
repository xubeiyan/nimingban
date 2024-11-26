import { json } from '@sveltejs/kit';
import { JWTAuth } from '$lib/auth.js';

export const GET = async ({ locals, request }) => {
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

	// 查询section表中的id和section_name以及board表中的id和board_name
	const result = await dbconn.query(
		`SELECT 
            s.id AS section_id, s.section_name, 
            b.id AS board_id, b.min_post_second, b.access_type, b.name AS board_name, b.url_name, b.intro, b.order 
        FROM section AS s LEFT JOIN board AS b ON s.id = b.parent_section_id ORDER BY b.order;`
	);

	const forums = [];
	result.rows.forEach((one) => {
		const section_id = one.section_id;
		const filtered = forums.filter((f) => f.section_id == section_id);

		if (filtered.length == 0) {
			forums.push({
				section_id,
				section_name: one.section_name,
				boards: []
			});
		}

		// 插入了之后需要重新获取，filtered不会自动更新
		const filteredSection = forums.filter((f) => f.section_id == section_id);
		if (filteredSection.length != 1) return;
		filteredSection[0].boards.push({
            id: one.board_id,
            min_post_second: one.min_post_second,
            access_type: one.access_type,
			name: one.board_name,
			url: one.url_name,
			intro: one.intro
		});
	});

	return json({
		type: 'ok',
		forumList: forums
	});
};
