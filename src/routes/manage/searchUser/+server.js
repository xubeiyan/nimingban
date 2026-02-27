import { json } from '@sveltejs/kit';
import { JWTAuth, getJWTSecretDB } from '$lib/auth';
import { getUserTypeValue } from '$lib/user/utils';

export const POST = async ({ request, locals }) => {
	const { dbconn } = locals;
	const { secret: jwt } = await getJWTSecretDB(dbconn);
	const authRes = JWTAuth(request, jwt);

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

	let { username, start_date, end_date } = await request.json();

	// 根据是否有 username 和 start_time 和 end_time 设置不同的SQL
	let partSql = [];
	let params = [];

	if (username != null && username != "") {
		params.push(username);
		partSql.push("username = ?")
	}

	if (start_date != null && start_date != "") {
		params.push(start_date)
		partSql.push("create_timestamp >= TO_TIMESTAMP(?, 'YYYY-MM-DD HH24:MI:SS')")
	}

	if (end_date != null && end_date != "") {
		params.push(end_date)
		partSql.push("create_timestamp <= to_timestamp(?, 'YYYY-MM-DD HH24:MI:SS')")
	}

	// 垃圾node-postgres，只支持$1, $2，可变数量的参数还只能手动替换
	// 将?替换为对应的$1$2
	for (let i = 0; i < partSql.length; ++i) {
		partSql[i] = partSql[i].replace("?", `$${i+1}`)
	}

	let sql = `
		SELECT 
		  id, username, status, type, reset_password,
          to_char(create_timestamp, 'YYYY-MM-DD HH24:MI:SS') AS create_time 
        FROM 
		  "user" 
		${partSql.length > 0 ? "WHERE" : ""}
		  ${partSql.join(" AND ")}
		ORDER BY 
		  create_timestamp DESC
		LIMIT 20`

    // console.log(sql);

	let userSeachQuery = {
		text: sql,
		values: params
	};

	const userSearchResult = await dbconn.query(userSeachQuery);

	if (userSearchResult.rowCount == 0) {
		return json({
			type: 'ok',
			result: []
		});
	}

	return json({
		type: 'ok',
		result: userSearchResult.rows.map((r) => ({
			id: r.id,
			username: r.username,
			type: getUserTypeValue(r.type),
			status: r.status,
			createTime: r.create_time,
			resetPass: r.reset_password
		}))
	});
};
