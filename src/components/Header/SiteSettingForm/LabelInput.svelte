<script>
	import CheckIcon from '$svgIcon/check.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
	import CloseCircleIcon from '$svgIcon/closeCircle.svelte';

	import { createMutation } from '@tanstack/svelte-query';

	import { refreshToken } from '$lib/refreshToken';
	import { userStore } from '../../../store/userStore';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let name = null;
	export let value = null;
	export let nameText = null;

	let inputValue = null;

	const clearInput = () => {
		inputValue = null;
	};

	const updateSetting = async () => {
		const res = await $updateMutation.mutateAsync();
		if (res.type != 'ok') {
			return;
		}

		dispatch('updateValue', { name, value: inputValue });
		inputValue = null;
	};

	const updateMutation = createMutation({
		mutationFn: async () => {
			let headers = {};

			// 有userStore.token字段则附上
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);

			const res = await fetch('/manage/updateSetting', {
				method: 'POST',
				body: JSON.stringify({
					name,
					value: inputValue
				}),
				headers
			}).then((r) => r.json());

			return res;
		}
	});
</script>

<label class="flex flex-col gap-1 bg-sky-200 dark:bg-sky-800 rounded-md px-4 py-2">
	<span>{nameText} ({name})</span>
	<div class="flex gap-2">
		<div class="w-1/2 rounded-md flex items-center">
			<span class="bg-sky-100 dark:bg-sky-700 rounded-l-md px-2 py-0.5">现有值</span>
			<input
				readonly
				class="bg-slate-100/70 dark:bg-slate-600 outline-none grow px-2 py-0.5 shadow-inner rounded-r-md"
				{value}
			/>
		</div>
		<div class="w-1/2 rounded-md flex items-center">
			<span class="bg-sky-100 dark:bg-sky-700 rounded-l-md px-2 py-0.5">修改为</span>
			<div
				class="grow flex items-center
            bg-slate-100 dark:bg-slate-700 rounded-r-md pl-2 pr-1 py-0.5"
			>
				<input class="outline-none bg-transparent grow" bind:value={inputValue} />
				{#if inputValue != null}
					<button class="ml-2" on:click={clearInput}>
						<CloseCircleIcon />
					</button>
				{/if}
			</div>
			{#if inputValue != null}
				<button class="ml-2" disabled={$updateMutation.isPending} on:click={updateSetting}>
					{#if $updateMutation.isPending}
						<LoadingIcon size="1.25em" />
					{:else}
						<CheckIcon />
					{/if}
				</button>
			{/if}
		</div>
	</div>
</label>
