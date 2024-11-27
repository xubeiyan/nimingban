<script>
	import { userStore } from '../../../store/userStore';

	import AccessTypeSelect from './AccessTypeSelect.svelte';
	import Input from './Input.svelte';
	import TextArea from './TextArea.svelte';

	import CloseIcon from '$svgIcon/close.svelte';
	import CheckIcon from '$svgIcon/check.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';

	import { createMutation } from '@tanstack/svelte-query';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let sectionId = null;

	let board = {
		name: null,
		url: null,
		intro: null,
		min_post_second: 10,
		access_type: 'hidden'
	};

	let errorText = null;

	const addClick = async () => {
		let emptyString = [];
		if (board.name == null) {
			emptyString.push('版块名称');
		}
		if (board.url == null) {
			emptyString.push('版块URL');
		}
		if (board.intro == null) {
			emptyString.push('版块简介');
		}

		if (emptyString.length > 0) {
			errorText = `${emptyString.join(', ')}是空的`;
			return;
		}

		if (sectionId == null) {
			errorText = `分区ID为空`;
			return;
		}

		const res = await $addBoardMutation.mutateAsync();

		if (res.type == 'error') {
			if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				errorText = '用户不允许进行此操作';
				return;
			} else if (res.errorCode == 'NO_SUCH_SECTION') {
				errorText = '对应分区不存在';
				return;
			} else if (res.errorCode == 'DUPLICATE_BOARD_URL') {
				errorText = '版块url重复';
				return;
			}
		}

		dispatch('btnClick', {
			type: 'ok',
			board: {
				id: res.boardId,
				...board
			}
		});
	};

	const addBoardMutation = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}
			const res = await fetch('/manage/addBoard', {
				method: 'POST',
				body: JSON.stringify({
					sectionId,
					...board
				}),
				headers
			}).then((r) => r.json());

			return res;
		}
	});
</script>

<li class="relative bg-indigo-200/70 dark:bg-sky-600 p-4 rounded-md">
	<button
		class="absolute right-4 top-4 rounded-full p-1
		bg-slate-200 dark:bg-slate-200/30
		hover:bg-slate-300 dark:hover:bg-slate-200/50"
		on:click={() => dispatch('btnClick', { type: 'cancel' })}
	>
		<CloseIcon />
	</button>
	<h1 class="text-zinc-200xl pb-2">新增版块</h1>
	<div class="grid grid-cols-2 gap-2 grow">
		<div class="flex flex-col">
			<span class="pl-1">版块名称</span>
			<div class="flex gap-1">
				<Input
					value={board.name}
					on:input={(e) => {
						errorText = null;
						board.name = e.target.value;
					}}
				/>
			</div>
		</div>
		<div class="flex flex-col">
			<span class="pl-1">版块URL</span>
			<div class="flex gap-1">
				<Input
					value={board.url}
					on:input={(e) => {
						errorText = null;
						board.url = e.target.value;
					}}
				/>
			</div>
		</div>
		<div class="flex flex-col">
			<span class="pl-1">最短发串间隔</span>
			<div class="flex gap-1">
				<Input
					value={board.min_post_second}
					suffix="秒"
					on:input={(e) => {
						errorText = null;
						board.min_post_second = e.target.value;
					}}
				/>
			</div>
		</div>
		<div class="flex flex-col">
			<span class="pl-1">访问类型</span>
			<div class="flex gap-1">
				<AccessTypeSelect
					value={board.access_type}
					on:select={(e) => {
						errorText = null;
						board.access_type = e.detail;
					}}
				/>
			</div>
		</div>
		<div class="flex flex-col col-span-2">
			<span class="pl-1">版块简介 (支持Markdown语法)</span>
			<div class="flex gap-1">
				<TextArea
					value={board.intro}
					on:input={(e) => {
						errorText = null;
						board.intro = e.target.value;
					}}
				/>
			</div>
		</div>
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

		<button class="rounded-md bg-violet-300/80 dark:bg-violet-400/70 px-2 py-1" on:click={addClick}>
			{#if $addBoardMutation.isPending}
				<LoadingIcon size="1.25em"/>
			{:else}
				<CheckIcon />
			{/if}
		</button>
	</div>
</li>
