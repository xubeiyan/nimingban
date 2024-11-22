export const load = async ({ locals }) => {
	const { dbconn } = locals;
	// 查询section表中的id和section_name以及board表中的id和board_name
	const result = await dbconn.query(
		`SELECT 
            s.id AS section_id, s.section_name, 
            b.id AS board_id, b.name AS board_name, b.url_name, b.intro, b.order 
        FROM section AS s LEFT JOIN board AS b ON s.id = b.parent_section_id ORDER BY b.order;`
	);
	// 没有则返回空
	if (result.rows == undefined || result.rows.length == 0) {
		return {
			forums: []
		};
	}

	/* 将查询的结果
    [{
        section_id: "1",
        section_name: "综合",
        board_id: "11",
        board_name: "综合版"
    }, {
        section_id: "1",
        section_name: "综合",
        board_id: "11",
        board_name: "欢乐恶搞"
    }]
    转变为如下的结构
    [{
        section_id: "1"
        section_name: "综合",
        boards: [{
            board_id: "11",
            board_name: "综合版",
        }, {
            board_id: "12",
            board_name: "欢乐恶搞"
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

		if (one.board_id != null) {
			// 插入了之后需要重新获取，filtered不会自动更新
			const filtered = forums.filter((f) => f.section_id == section_id);
			if (filtered.length != 1) return;
			filtered[0].boards.push({
				board_id: one.board_id,
				board_name: one.board_name,
				board_url: one.url_name,
				intro: one.intro
			});
		}
	});

	// console.log(forums);
	return { forums };
};
