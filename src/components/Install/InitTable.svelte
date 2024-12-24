<script>
	import { createMutation } from '@tanstack/svelte-query';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let initTableStatus = 'idle';

	$: checkStatusStyle = initTableStatus == 'success' ? 'hidden' : '';

	const initTableMutation = createMutation({
		mutationFn: async () => {
			const res = await fetch('/install/initTable').then((r) => r.json());

			if (res.type == 'error') {
				return;
			}

			initTableStatus = 'success';
			dispatch('stageChange', { to: 'manage_account' });
		}
	});

	$: btnText = $initTableMutation.isPending ? '进行中...' : '初始化数据表';
</script>

<div
	class="mt-2 rounded-md bg-slate-200 dark:bg-sky-700 px-4 py-2 flex justify-between items-center"
>
	<h1 class="text-xl">初始化数据表</h1>
	{#if initTableStatus == 'success'}
		<span class="text-green-600 dark:text-green-400">初始化成功</span>
	{/if}
</div>
<form
	class="mt-2 rounded-md shadow-inner dark:shadow-sky-800
            bg-slate-100 dark:bg-sky-800
            px-4 py-4 {checkStatusStyle}"
>
	<div class="flex justify-end gap-2">
		<button
			class="bg-sky-200 dark:bg-sky-600 rounded-md px-2 py-1"
			disabled={$initTableMutation.isPending}
			on:click={() => $initTableMutation.mutate()}>{btnText}</button
		>
	</div>
</form>
