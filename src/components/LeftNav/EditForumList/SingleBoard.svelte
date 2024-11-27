<script>
	import { userStore } from '../../../store/userStore';

	import Input from './Input.svelte';
	import UndoBtn from './UndoBtn.svelte';
	import AccessTypeSelect from './AccessTypeSelect.svelte';
	import TextArea from './TextArea.svelte';
	import IconBtn from './IconBtn.svelte';

	import TrashIcon from '$svgIcon/trash.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
	import CheckIcon from '$svgIcon/check.svelte';

	import { createMutation } from '@tanstack/svelte-query';

	import { createEventDispatcher } from 'svelte';
	import DeleteDialog from './DeleteDialog.svelte';
	const dispatch = createEventDispatcher();

	export let board = {};
	export let index = 0;

	// 删除确认对话框
	let deleteDialog = null;

	// 显示修改保存按钮
	$: saveBtnShow =
		newBoard.name || newBoard.url || newBoard.minPostSecond || newBoard.accessType || newBoard.intro
			? 'visible'
			: 'invisible';

	// 新的内容
	let newBoard = {
		name: undefined,
		url: undefined,
		minPostSecond: undefined,
		accessType: undefined,
		intro: undefined
	};

	const update = (type, value) => {
		newBoard[type] = value;
	};

	const undo = (type) => {
		newBoard[type] = undefined;
	};

	// 版块向后移
	const moveBoardForward = (index) => {
		dispatch('move', {
			type: 'boardForward',
			index
		});
	};

	// 版块向前移
	const moveBoardBackward = (index) => {
		dispatch('move', {
			type: 'boardBackward',
			index
		});
	};

	// 提交版块修改
	const updateBoard = async () => {
		// console.log(board);
		const { id, name, url, min_post_second, access_type, intro } = board;
		const postBody = {
			id,
			name: newBoard.name ? newBoard.name : name,
			url: newBoard.url ? newBoard.url : url,
			minPostSecond: newBoard.minPostSecond ? newBoard.minPostSecond : min_post_second,
			accessType: newBoard.accessType ? newBoard.accessType : access_type,
			intro: newBoard.intro ? newBoard.intro : intro
		};

		const res = await $boardModifyMutation.mutateAsync(postBody);

		if (res.type == 'ok') {
			newBoard = {
				name: undefined,
				url: undefined,
				minPostSecond: undefined,
				accessType: undefined,
				intro: undefined
			};
			dispatch('updateBoards');
		}
	};

	const boardModifyMutation = createMutation({
		mutationFn: async (body) => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			const res = await fetch('/manage/updateBoard', {
				method: 'POST',
				body: JSON.stringify(body),
				headers
			}).then((r) => r.json());

			return res;
		}
	});

	const openDeleteConfirm = () => {
		if (deleteDialog == null) return;
		deleteDialog.openDialog({ name: board.name, id: board.id });
	};
</script>

<li
	class="flex items-start gap-2
        pl-4"
>
	<div class="flex flex-col gap-4 justify-center self-stretch">
		<IconBtn hintText="上移" on:click={() => moveBoardBackward(index)}>👆</IconBtn>
		<IconBtn hintText="下移" on:click={() => moveBoardForward(index)}>👇</IconBtn>
		<IconBtn hintText="删除" on:click={openDeleteConfirm}>
			<TrashIcon size="1.5em" />
		</IconBtn>
	</div>
	<div class="grid grid-cols-2 gap-2 grow bg-indigo-100 dark:bg-sky-400/30 px-4 py-4 rounded-md">
		<div class="flex flex-col">
			<span class="pl-1">版块名称</span>
			<div class="flex gap-1">
				<Input
					value={newBoard.name != undefined ? newBoard.name : board.name}
					on:input={(e) => update('name', e.target.value)}
				/>
				<UndoBtn show={newBoard.name != undefined} on:click={() => undo('name')} />
			</div>
		</div>
		<div class="flex flex-col">
			<span class="pl-1">版块URL</span>
			<div class="flex gap-1">
				<Input
					value={newBoard.url != undefined ? newBoard.url : board.url_name}
					on:input={(e) => update('url', e.target.value)}
				/>
				<UndoBtn show={newBoard.url != undefined} on:click={() => undo('url')} />
			</div>
		</div>
		<div class="flex flex-col">
			<span class="pl-1">最短发串间隔</span>
			<div class="flex gap-1">
				<Input
					suffix="秒"
					value={newBoard.minPostSecond != undefined
						? newBoard.minPostSecond
						: board.min_post_second}
					on:input={(e) => update('minPostSecond', e.target.value)}
				/>
				<UndoBtn
					show={newBoard.minPostSecond != undefined}
					on:click={() => undo('minPostSecond')}
				/>
			</div>
		</div>
		<div class="flex flex-col">
			<span class="pl-1">可见性</span>
			<div class="flex gap-1">
				<AccessTypeSelect
					value={newBoard.accessType !== undefined ? newBoard.accessType : board.access_type}
					on:select={(e) => update('accessType', e.detail)}
				/>
				<UndoBtn show={newBoard.accessType != undefined} on:click={() => undo('accessType')} />
			</div>
		</div>
		<div class="flex flex-col col-span-2">
			<span class="pl-1">版块简介 (支持Markdown语法)</span>
			<div class="flex gap-1">
				<TextArea
					value={newBoard.intro !== undefined ? newBoard.intro : board.intro}
					on:input={(e) => update('intro', e.target.value)}
				/>
				<UndoBtn show={newBoard.intro != undefined} on:click={() => undo('intro')} />
			</div>
		</div>
	</div>
	<div class="flex flex-col self-stretch justify-center {saveBtnShow}">
		<IconBtn hintText="保存" on:click={updateBoard}>
			{#if $boardModifyMutation.isPending}
				<LoadingIcon />
			{:else}
				<CheckIcon />
			{/if}
		</IconBtn>
	</div>
</li>
<DeleteDialog bind:this={deleteDialog} on:updateBoards={() => dispatch('updateBoards')} />
