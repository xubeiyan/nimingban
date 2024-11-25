<script>
	import Input from './Input.svelte';
	import AccessTypeSelect from './AccessTypeSelect.svelte';
	import TextArea from './TextArea.svelte';
	import IconBtn from './IconBtn.svelte';

	import PlusIcon from '$svgIcon/plus.svelte';
	import RightIcon from '$svgIcon/right.svelte';
	import CheckIcon from '$svgIcon/check.svelte';
	import TrashIcon from '$svgIcon/trash.svelte';

	import { createEventDispatcher } from 'svelte';
	import UndoBtn from './UndoBtn.svelte';
	import NewBoard from './NewBoard.svelte';

	const dispatch = createEventDispatcher();

	export let forum = {};

	let open = false;

	// 新
	$: boardsStyle = open ? 'h-auto' : 'hidden';

	const update = (type, section_id, board_id, value) => {
		dispatch('update', {
			type,
			section_id,
			board_id,
			value
		});
	};

	const undo = (type, section_id, board_id) => {
		dispatch('undo', {
			type,
			section_id,
			board_id
		});
	};

	// 分区向后移
	const moveSectionForward = () => {
		dispatch('move', {
			type: 'sectionForward',
			section_id: forum.section_id
		});
	};

	// 分区向前移
	const moveSectionBackward = () => {
		dispatch('move', {
			type: 'sectionBackward',
			section_id: forum.section_id
		});
	};

	// 版块向后移
	const moveBoardForward = (index) => {
		dispatch('move', {
			type: 'boardForward',
			section_id: forum.section_id,
			index
		});
	};

	// 版块向前移
	const moveBoardBackward = (index) => {
		dispatch('move', {
			type: 'boardBackward',
			section_id: forum.section_id,
			index
		});
	};

	// 新增的版块
	let boardAdd = null;

	// 添加模板
	const createBoardAddTemplate = () => {
		boardAdd = {
			name: null,
			url: null,
			intro: null
		};
	};

	let tempBoardId = 1000;
	// 添加/取消版块按钮点击
	const handleBoardBtnClick = (e) => {
		const { type } = e.detail;
		if (type == 'cancel') {
			boardAdd = null;
		} else if (type == 'add') {
			const { board } = e.detail;
			dispatch('tempBoard', {
				type: 'add',
				section_id: forum.section_id,
				board: {
					id: `tempboard_${tempBoardId}`,
					...board
				}
			});
			tempBoardId += 1;
			boardAdd = null;
		}
	};

	// 删除要添加的版块
	const removeToAddBoard = (id) => {
		dispatch('tempBoard', {
			type: 'delete',
			section_id: forum.section_id,
			board: {
				id
			}
		});
	};
</script>

<li
	class="relative flex items-center gap-2
    bg-violet-100 dark:bg-indigo-400/30 px-4 py-2 rounded-md"
>
	<IconBtn
		hintText={open ? '收起' : '展开'}
		on:click={() => {
			open = !open;
		}}
	>
		<RightIcon turn={open ? 90 : 0} />
	</IconBtn>
	<div class="flex flex-col grow mr-2">
		<span class="mb-1 pl-1">分区名称</span>
		<div class="flex gap-1">
			<Input
				value={forum.section_name_new ? forum.section_name_new : forum.section_name}
				on:input={(e) => update('section_name', forum.section_id, null, e.target.value)}
			/>
			<UndoBtn
				show={forum.section_name_new != undefined}
				on:click={() => undo('section_name', forum.section_id, null)}
			/>
		</div>
	</div>
	<div class="flex flex-col justify-between">
		<div class="flex gap-1">
			<IconBtn hintText="上移" on:click={moveSectionBackward}>👆</IconBtn>
			<IconBtn hintText="下移" on:click={moveSectionForward}>👇</IconBtn>
		</div>
	</div>
</li>
<ul class="space-y-1 {boardsStyle}">
	{#each forum.boards as board, index}
		<li
			class="flex items-start ml-10 gap-4
        bg-indigo-100 dark:bg-sky-400/30
        px-4 py-4 rounded-md"
		>
			<div class="grid grid-cols-2 gap-2 grow">
				<div class="flex flex-col">
					<span class="pl-1">版块名称</span>
					<div class="flex gap-1">
						<Input
							value={board.board_name_new ? board.board_name_new : board.board_name}
							on:input={(e) =>
								update('board_name', forum.section_id, board.board_id, e.target.value)}
						/>
						<UndoBtn
							show={board.board_name_new != undefined}
							on:click={() => undo('board_name', forum.section_id, board.board_id)}
						/>
					</div>
				</div>
				<div class="flex flex-col">
					<span class="pl-1">版块URL</span>
					<div class="flex gap-1">
						<Input
							value={board.board_url_new ? board.board_url_new : board.board_url}
							on:input={(e) =>
								update('board_url', forum.section_id, board.board_id, e.target.value)}
						/>
						<UndoBtn
							show={board.board_url_new != undefined}
							on:click={() => undo('board_url', forum.section_id, board.board_id)}
						/>
					</div>
				</div>
				<div class="flex flex-col">
					<span class="pl-1">最短发串间隔</span>
					<div class="flex gap-1">
						<Input
							value={board.min_post_second_new ? board.min_post_second_new : board.min_post_second}
							suffix="秒"
							on:input={(e) =>
								update('min_post_second', forum.section_id, board.board_id, e.target.value)}
						/>
						<UndoBtn
							show={board.min_post_second_new != undefined}
							on:click={() => undo('min_post_second', forum.section_id, board.board_id)}
						/>
					</div>
				</div>
				<div class="flex flex-col">
					<span class="pl-1">可见性</span>
					<div class="flex gap-1">
						<AccessTypeSelect
							value={board.access_type_new ? board.access_type_new : board.access_type}
							on:select={(e) => update('access_type', forum.section_id, board.board_id, e.detail)}
						/>
						<UndoBtn
							show={board.access_type_new != undefined}
							on:click={() => undo('access_type', forum.section_id, board.board_id)}
						/>
					</div>
				</div>
				<div class="flex flex-col col-span-2">
					<span class="pl-1">版块简介 (支持Markdown语法)</span>
					<div class="flex gap-1">
						<TextArea
							value={board.intro_new ? board.intro_new : board.intro}
							on:input={(e) => update('intro', forum.section_id, board.board_id, e.target.value)}
						/>
						<UndoBtn
							show={board.intro_new != undefined}
							on:click={() => undo('intro', forum.section_id, board.board_id)}
						/>
					</div>
				</div>
			</div>
			<div class="flex flex-col self-stretch justify-between">
				<div class="flex gap-1">
					<IconBtn hintText="上移" on:click={() => moveBoardBackward(index)}>👆</IconBtn>
					<IconBtn hintText="下移" on:click={() => moveBoardForward(index)}>👇</IconBtn>
				</div>
				{#if board.board_id.startsWith('tempboard_')}
					<div class="flex gap-1">
						<IconBtn hintText="删除" on:click={() => removeToAddBoard(board.board_id)}>
							<TrashIcon size="1.5em" />
						</IconBtn>
					</div>
				{/if}
			</div>
		</li>
	{/each}
	<li class="ml-10">
		{#if boardAdd == null}
			<button
				class="bg-indigo-200/50 dark:bg-sky-500/30
              hover:bg-indigo-200/70 dark:hover:bg-sky-500/50 rounded-md flex justify-center items-center w-full h-[4em]
                px-2 py-1"
				on:click={createBoardAddTemplate}
			>
				<PlusIcon size="1.5em" />
			</button>
		{:else}
			<NewBoard on:btnClick={handleBoardBtnClick} />
		{/if}
	</li>
</ul>
