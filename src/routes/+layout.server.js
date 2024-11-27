export const load = async ({ locals }) => {
	const { dbconn } = locals;
	// 查询section表中的id和section_name以及board表中的id和board_name
	const result = await dbconn.query(
		`SELECT 
            s.id AS section_id, s.section_name, 
            b.name AS board_name, b.url_name, b.intro
        FROM section AS s JOIN board AS b ON 
			b.access_type IN ('all', 'view_only') AND s.id = b.parent_section_id 
		ORDER BY b.order;`
	);
	// 没有则返回空
	if (result.rowCount == 0) {
		return {
			forums: []
		};
	}
	/* 将查询的结果
    [{
        section_id: "1",
        section_name: "综合",
        board_name: "综合版"
		url_name: "notopic"
		intro: "随便写点"
    }, {
        section_id: "1",
        section_name: "综合",
        board_name: "欢乐恶搞",
		url_name: "funny"
		intro: "既不欢乐也不恶搞"
    }]
    转变为如下的结构
    [{
        section_id: "1"
        section_name: "综合",
        boards: [{
            board_name: "综合版",
			url_name: "notopic"
			intro: "随便写点"
        }, {
            board_name: "欢乐恶搞",
			url_name: "funny"
			intro: "既不欢乐也不恶搞"
        }]
    }]
    */
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
			board_name: one.board_name,
			board_url: one.url_name,
			intro: one.intro
		});
	});

	return { forums };
};
