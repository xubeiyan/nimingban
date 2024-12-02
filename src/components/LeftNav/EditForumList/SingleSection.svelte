<script>
	import { userStore } from '../../../store/userStore';

	import Input from './Input.svelte';
	import IconBtn from './IconBtn.svelte';
	import UndoBtn from './UndoBtn.svelte';
	import NewBoard from './NewBoard.svelte';
	import SingleBoard from './SingleBoard.svelte';
	import StatusText from './StatusText.svelte';

	import LoadingIcon from '$svgIcon/loading.svelte';
	import PlusIcon from '$svgIcon/plus.svelte';
	import RightIcon from '$svgIcon/right.svelte';
	import CheckIcon from '$svgIcon/check.svelte';
	import TrashIcon from '$svgIcon/trash.svelte';
	import SortIcon from '$svgIcon/sort.svelte';

	import { createEventDispatcher } from 'svelte';
	import { refreshToken } from '$lib/refreshToken';
	import { createMutation } from '@tanstack/svelte-query';
	const dispatch = createEventDispatcher();

	export let forum = {};

	let newForum = {
		name: undefined
	};

	let boards = [];

	let open = false;

	let errorText = null;
	let sectionErrorText = null;

	// 打开/关闭分区列表
	const toggleSectionOpen = () => {
		// 打开
		if (open == false) {
			$fetchBoards.mutate();
		}

		// 关闭
		if (open == true) {
			// 清空版块
			boards = [];
			errorText = null;
		}

		open = !open;
	};

	const fetchBoards = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);

			const res = await fetch(`/manage/getBoardList/${forum.id}`, {
				headers
			}).then((r) => r.json());

			if (res.type != 'ok') {
				if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
					errorText = '当前用户不允许此操作';
				} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
					errorText = `认证字段不正确`;
				} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
					errorText = `需要退出后重新登录`;
				}
				return;
			}

			boards = res.boards;
		}
	});

	// 新
	$: boardsStyle = open ? 'h-auto' : 'hidden';

	let boardModifyMessage = null;

	const deleteSection = async () => {
		const res = await $deleteMutation.mutateAsync();

		if (res.type != 'ok') {
			if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				sectionErrorText = '当前用户不允许此操作';
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				sectionErrorText = `认证字段不正确`;
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				sectionErrorText = `需要退出后重新登录`;
			} else if (res.errorCode == 'SECTION_EXIST_BOARD') {
				sectionErrorText = `分区中有板块不能删除`;
			}
			return;
		}

		dispatch('updateSections');
	};

	const deleteMutation = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);

			const res = await fetch(`/manage/removeSection/${forum.id}`, {
				headers
			}).then((r) => r.json());

			return res;
		}
	});

	// 分区向后移
	const moveSectionForward = () => {};

	// 分区向前移
	const moveSectionBackward = () => {};

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

	// 添加/取消版块按钮点击
	const handleBoardBtnClick = (e) => {
		const { type } = e.detail;
		if (type == 'cancel') {
			boardAdd = null;
		} else if (type == 'ok') {
			const { board } = e.detail;
			boards.push(board);
			boards = boards;

			boardAdd = null;
		}
	};
</script>

<li class="relative flex gap-2 items-center">
	<div class="flex flex-col gap-2 justify-around">
		<IconBtn hintText="上移">👆</IconBtn>
		<IconBtn hintText="下移">👇</IconBtn>
	</div>
	<div
		class="grow relative flex items-center gap-2 bg-violet-100 dark:bg-indigo-400/30
		px-4 py-2 rounded-md"
	>
		<div class="flex flex-col">
			<IconBtn hintText={open ? '收起' : '展开'} on:click={toggleSectionOpen}>
				<RightIcon turn={open ? 90 : 0} />
			</IconBtn>
		</div>
		<div class="flex flex-col grow">
			<span class="mb-1 pl-1">分区名称</span>
			<div class="flex gap-1">
				<div class="flex gap-1 w-1/2">
					<Input
						value={newForum.name != undefined ? newForum.name : forum.name}
						on:input={(e) => {
							newForum.name = e.target.value;
						}}
					/>
					<UndoBtn
						show={newForum.name != undefined}
						on:click={() => {
							newForum.name = undefined;
						}}
					/>
				</div>
				<div class="w-1/2">
					<div class="flex justify-end gap-2">
						{#if sectionErrorText != null}
							<span
								class="flex items-center gap-1 px-2 rounded-md
								border border-red-400 dark:border-red-400
								text-red-400 dark:text-red-400"
								>{sectionErrorText}
								<button
									on:click={() => {
										sectionErrorText = null;
									}}>×</button
								>
							</span>
						{/if}
						<IconBtn hintText="删除" on:click={deleteSection}>
							{#if $deleteMutation.isPending}
								<LoadingIcon size="1.5em" />
							{:else}
								<TrashIcon size="1.5em" />
							{/if}
						</IconBtn>
					</div>
				</div>
			</div>
		</div>
		<div class="absolute top-2 right-2"></div>
	</div>
	<div class={newForum.name == undefined ? 'invisible' : ''}>
		<IconBtn>
			<CheckIcon />
		</IconBtn>
	</div>
</li>
{#if $fetchBoards.isPending}
	<StatusText>获取中...</StatusText>
{:else if $fetchBoards.isSuccess}
	{#if errorText == null}
		<ul class="space-y-1 {boardsStyle}">
			{#each boards as board, index}
				<SingleBoard {board} {index} on:updateBoards={$fetchBoards.mutate()} />
			{/each}
			<li class="pl-20 mr-10">
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
					<NewBoard sectionId={forum.id} on:btnClick={handleBoardBtnClick} />
				{/if}
			</li>
		</ul>
	{:else}
		<StatusText type="error">
			{errorText}
		</StatusText>
	{/if}
{/if}
