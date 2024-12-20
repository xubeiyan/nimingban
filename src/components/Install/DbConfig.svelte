<script>
	import { createMutation } from '@tanstack/svelte-query';

	import ReadonlyInputLabel from '$cmpns/Install/ReadonlyInputLabel.svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let db = {
		host: null,
		database: null,
		user: null,
		password: null,
		port: null
	};

	let dbCheck = 'idle';
	$: checkStatusStyle = dbCheck == 'success' ? 'hidden' : '';

	let dbCheckError = null;
	$: dbAccessCheckText = $dbAccessCheck.isPending ? '尝试连接...' : '测试数据库连接';

	let initTable = 'idle';

	const dbAccessCheck = createMutation({
		mutationFn: async () => {
			dbCheckError = null;
			const res = await fetch('/install/connectDb').then((r) => r.json());

			if (res.type == 'error') {
				if (res.errorCode == 'SERVER_REFUSED_CONNECTION') {
					dbCheckError = '服务器拒绝了连接，请检查数据库服务器地址';
				} else if (res.errorCode == 'DATABASE_AUTH_FAILED') {
					dbCheckError = '连接的用户名和密码错误';
				}

				return;
			}

			dbCheck = 'success';
			dispatch('stageChange', { to: 'init_table' });
		}
	});
</script>

<div class="rounded-md bg-slate-200 dark:bg-sky-700 px-4 py-2 flex justify-between items-center">
	<h1 class="text-xl">数据库配置</h1>
	{#if dbCheck == 'success'}
		<span class="text-green-600 dark:text-green-400">检查成功</span>
	{/if}
</div>

<form
	class="mt-2 rounded-md shadow-inner dark:shadow-sky-800
        bg-slate-100 dark:bg-sky-800
        px-4 py-4 {checkStatusStyle}"
>
	<div class="rounded-md border border-sky-200 dark:border-sky-600 px-2 py-1 mb-2">
		<span>从 .env 中读取的配置</span>
	</div>
	<ReadonlyInputLabel label="数据库服务器地址" value={db.host} />
	<ReadonlyInputLabel label="数据库名称" value={db.database} />
	<ReadonlyInputLabel label="登录用户名" value={db.user} />
	<ReadonlyInputLabel label="登录密码" value={db.password} />
	<ReadonlyInputLabel label="数据库端口" value={db.port} />
	<div class="flex justify-end gap-2">
		{#if dbCheckError != null}
			<span
				class="rounded-md border border-red-400 dark:border-red-300
                px-2 flex items-center text-red-400 dark:text-red-300">{dbCheckError}</span
			>
		{/if}
		<button
			class="bg-sky-200 dark:bg-sky-600 rounded-md px-2 py-1"
			disabled={$dbAccessCheck.isPending}
			on:click={() => $dbAccessCheck.mutate()}>{dbAccessCheckText}</button
		>
	</div>
</form>
