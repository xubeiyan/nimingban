<script>
	import Input from './Input.svelte';

	import IconBtn from './IconBtn.svelte';
	import UndoBtn from './UndoBtn.svelte';
	import NewBoard from './NewBoard.svelte';
	import SingleBoard from './SingleBoard.svelte';

	import LoadingIcon from '$svgIcon/loading.svelte';
	import PlusIcon from '$svgIcon/plus.svelte';
	import RightIcon from '$svgIcon/right.svelte';
	import CheckIcon from '$svgIcon/check.svelte';
	import TrashIcon from '$svgIcon/trash.svelte';
	import SortIcon from '$svgIcon/sort.svelte';

	import { createEventDispatcher } from 'svelte';
	import Sort from '$svgIcon/sort.svelte';
	const dispatch = createEventDispatcher();

	export let forum = {};

	let open = false;

	// 新
	$: boardsStyle = open ? 'h-auto' : 'hidden';

	let boardModifyMessage = null;

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
</script>

<li
	class="relative flex items-center gap-4
    bg-violet-100 dark:bg-indigo-400/30 px-4 py-2 rounded-md"
>
	<div class="flex flex-col gap-2">
		<IconBtn
			hintText={open ? '收起' : '展开'}
			on:click={() => {
				open = !open;
			}}
		>
			<RightIcon turn={open ? 90 : 0} />
		</IconBtn>
	</div>
	<div class="flex flex-col grow mr-2">
		<span class="mb-1 pl-1">分区名称</span>
		<div class="flex gap-1">
			<Input
				value={forum.section_name_new ? forum.section_name_new : forum.section_name}
				on:input={() => {}}
			/>
			<UndoBtn show={forum.section_name_new != undefined} on:click={() => {}} />
		</div>
	</div>
</li>
<ul class="space-y-1 {boardsStyle}">
	{#each forum.boards as board, index}
		<SingleBoard {board} {index} on:updateAllSectionBoard />
	{/each}
	<li class="ml-14 mr-10">
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
			<NewBoard sectionId={forum.section_id} on:btnClick={handleBoardBtnClick} />
		{/if}
	</li>
</ul>
