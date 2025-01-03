<script>
	import { userStore } from '../../../store/userStore';
	import Input from './Input.svelte';
	import IconBtn from './IconBtn.svelte';
	import AddBtn from './AddBtn.svelte';

	import CloseIcon from '$svgIcon/close.svelte';

	import { createMutation } from '@tanstack/svelte-query';
	import { refreshToken } from '$lib/refreshToken';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const addSectionMutation = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);

			const res = await fetch('/manage/addSection', {
				method: 'POST',
				body: JSON.stringify({
					name: value
				}),
				headers
			}).then((r) => r.json());

			return res;
		}
	});

	const addClick = async () => {
		if (value == null) {
			errorText = '分区名称为空';
			return;
		}

		const res = await $addSectionMutation.mutateAsync();

		if (res.type != 'ok') {
			if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				errorText = '用户不允许进行此操作';
			} else if (res.errorCode == 'DUPLICATE_SECTION_NAME') {
				errorText = '分区名称和已有的重复';
			}
			return;
		}

		dispatch('btnClick', {
			type: 'ok',
			section: {
				id: res.sectionId,
				name: value
			}
		});
	};

	let value = null;
	let errorText = null;
</script>

<li
	class="relative p-4 rounded-md
    bg-violet-200 dark:bg-indigo-400/50"
>
	<button
		class="absolute right-4 top-4 rounded-full p-1
		bg-slate-200/60 dark:bg-slate-200/30
		hover:bg-slate-200 dark:hover:bg-slate-200/50"
		on:click={() => {
			dispatch('btnClick', { type: 'cancel' });
		}}
	>
		<CloseIcon />
	</button>
	<h1 class="text-xl pb-2">新增分区</h1>
	<div class="flex flex-col gap-1">
		<span>分区名称</span>
		<div>
			<Input
				{value}
				on:input={(e) => {
					value = e.target.value;
					errorText = null;
				}}
			/>
		</div>
		<div class="flex justify-end mt-4 gap-2">
			{#if errorText != null}
				<div
					class="inline-flex items-center
				border border-red-600 dark:border-red-300 rounded-md
				text-red-600 dark:text-red-300 px-2"
				>
					{errorText}
				</div>
			{/if}
			<AddBtn loading={$addSectionMutation.isPending} on:click={addClick} />
		</div>
	</div>
</li>
