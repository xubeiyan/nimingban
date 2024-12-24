<script>
	import DbConfig from '$cmpns/Install/DbConfig.svelte';
	import InitTable from '$cmpns/Install/InitTable.svelte';
	import BoardParam from '$cmpns/Install/BoardParam.svelte';
	import ManageAdminAccount from '$cmpns/Install/ManageAdminAccount.svelte';
	import ConfigComplete from '$cmpns/Install/ConfigComplete.svelte';

	export let data = {
		config_complete: null,
		db: {}
	};

	// 配置阶段，db_connection 为数据库配置，init_table 为建立表，
	// board_param 为匿名版参数配置，manage_account 为管理账号
	const stages = ['db_connection', 'init_table', 'manage_account', 'board_param'];

	const handleStageChange = ({ to }) => {
		const toStage = stages.indexOf(to);
		if (toStage == -1) return;

		stageIndex = toStage;
	};

	let stageIndex = 0;
</script>

{#if data.config_complete}
	<ConfigComplete />
{:else}
	<div class="container grow mx-auto py-4 divide-transparent">
		<DbConfig db={data.db} on:stageChange={(e) => handleStageChange(e.detail)} />
		{#if stageIndex >= 1}
			<InitTable on:stageChange={(e) => handleStageChange(e.detail)} />
		{/if}
		{#if stageIndex >= 2}
			<ManageAdminAccount on:stageChange={(e) => handleStageChange(e.detail)} />
		{/if}
		{#if stageIndex == 3}
			<BoardParam />
		{/if}
	</div>
{/if}
