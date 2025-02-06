// 参数列表
export const paramsTemplate = {
	site_name: {
		data_type: 'string',
		description: '匿名版名称'
	},
	jwt_secert: {
		data_type: 'string',
		description: 'JWT密钥'
	},
	jwt_expire_minute: {
		data_type: 'number',
		description: 'JWT过期时间（单位：分）'
	}
};
