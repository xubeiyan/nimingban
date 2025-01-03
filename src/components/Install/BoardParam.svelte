<script>
	import { createMutation } from '@tanstack/svelte-query';
	import EditInputLabel from './EditInputLabel.svelte';
	import { paramsTemplate } from '$lib/Install/siteParams';

	import { onMount } from 'svelte';

	let paramStatus = 'idle';

	let configs = [];

	const completeConfig = createMutation({
		mutationFn: async () => {
			const res = await fetch('/install/boardParam/completeConfig').then((r) => r.json());
			if (res.type == 'ok') {
				paramStatus = 'complete';
			}
		}
	});

	$: completeConfigBtnText = $completeConfig.isPending ? '请求中...' : '完成配置';

	const getConfig = createMutation({
		mutationFn: async () => {
			const res = await fetch('/install/boardParam/getConfig').then((r) => r.json());
			if (res.type != 'ok') return;

			configs = [];

			for (const [key, value] of Object.entries(paramsTemplate)) {
				const filtered = res.configs.filter((c) => c.name == key);

				let v = null;
				if (filtered.length == 1) {
					v = filtered[0].value;
				}

				configs.push({
					label: value.description,
					name: key,
					value: v
				});
			}

			configs = configs;
		}
	});

	onMount(() => {
		$getConfig.mutate();
	});
</script>

<div
	class="mt-2 rounded-md bg-slate-200 dark:bg-sky-700 px-4 py-2 flex justify-between items-center"
>
	<h1 class="text-xl">匿名版配置</h1>
	{#if paramStatus == 'complete'}
		<span class="text-green-600 dark:text-green-400">配置成功</span>
	{/if}
</div>
{#if paramStatus != 'complete'}
	<form
		class="mt-2 rounded-md shadow-inner dark:shadow-sky-800
        bg-slate-100 dark:bg-sky-800
        px-4 py-4"
	>
		{#each configs as c}
			<EditInputLabel
				label={c.label}
				name={c.name}
				value={c.value}
				on:update={() => $getConfig.mutate()}
			/>
		{/each}
		<div class="mt-2 flex justify-end">
			<button
				class="bg-sky-200 dark:bg-sky-600 rounded-md px-2 py-1"
				disabled={$completeConfig.isPending}
				on:click={() => $completeConfig.mutate()}>{completeConfigBtnText}</button
			>
		</div>
	</form>
{:else}
	<div
		class="mt-2 rounded-md shadow-inner dark:shadow-sky-800
        bg-slate-100 dark:bg-sky-800
        px-4 py-4"
	>
		<span>配置完成，请刷新整个页面。再登录管理员账号设置版面。</span>
	</div>
{/if}
