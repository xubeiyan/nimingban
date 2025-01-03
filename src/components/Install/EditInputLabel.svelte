<script>
	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let label = '未知label';
	export let value = null;
	export let name = null;

	let postBody = {
		name,
		value: null
	};

	$: submitDisable = postBody.value == null || postBody.value == '';

	const updateMutation = createMutation({
		mutationFn: async () => {
			const res = await fetch('/install/boardParam/updateConfig', {
				method: 'POST',
				body: JSON.stringify(postBody)
			}).then((r) => r.json());

			if (res.type == 'ok') {
				postBody.value = null;
				dispatch('update');
			}
		}
	});
</script>

<label class="flex flex-col gap-1 mb-2">
	<span>{label}</span>
	<div class="flex gap-2 w-full">
		<div
			class="flex items-center w-[45%] border border-slate-200 dark:border-sky-600
        bg-slate-200 dark:bg-sky-700
        rounded-md overflow-clip"
		>
			<span class="px-2 shrink-0">现在值</span>
			{#if value == null}
				<span
					class="grow border-l border-slate-200 dark:border-sky-600
                bg-orange-50 dark:bg-orange-500/20 px-2 py-0.5"
				>
					此值未配置
				</span>
			{:else}
				<input
					class="grow border-l border-slate-200 dark:border-sky-600
                bg-slate-100 dark:bg-sky-800
                px-2 py-0.5 outline-none"
					type="text"
					readonly
					{value}
				/>
			{/if}
		</div>

		<div
			class="flex items-center grow border border-slate-200 dark:border-sky-600
        bg-slate-200 dark:bg-sky-700
        rounded-md overflow-clip"
		>
			<span class="px-2 shrink-0">修改为</span>
			<input
				class="grow border-l border-slate-200 dark:border-sky-600
                 bg-slate-50 dark:bg-sky-900
                  focus-within:bg-white dark:focus-within:bg-sky-950 px-2 py-0.5 outline-none"
				type="text"
				bind:value={postBody.value}
			/>
		</div>

		<button
			class="shrink-0 px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-600
            disabled:dark:bg-sky-600/50 disabled:cursor-not-allowed"
			disabled={submitDisable}
			on:click={() => $updateMutation.mutate()}>修改</button
		>
	</div>
</label>
