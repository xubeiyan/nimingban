<script>
	import CheckIcon from '$svgIcon/check.svelte';
	import CloseIcon from '$svgIcon/close.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';

	import { userStore } from '../../../store/userStore';

	import { refreshToken } from '$lib/refreshToken';
	import { createMutation } from '@tanstack/svelte-query';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let open = false;
	let boardName = null;
	let boardId = null;
	let errorText = null;

	export const openDialog = ({ name, id }) => {
		boardName = name;
		boardId = id;
		open = true;
	};

	const closeDialog = () => {
		boardName = null;
		boardId = null;
		open = false;
	};

	$: showStyle = open ? '' : 'hidden';

	// 确认删除
	const confirmDelete = async () => {
		errorText = null;
		const res = await $deleteMutation.mutateAsync();
		if (res.type != 'ok') {
			if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				errorText = '当前用户不允许此操作';
			} else if (res.errorCode == 'NO_AUTHORIZATION_HEADER') {
				errorText = `没有认证字段`;
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				errorText = `认证字段不正确`;
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				errorText = `需要退出后重新登录`;
			} else if (res.errorCode == 'BOARD_EXIST_POST') {
				errorText = `删除版块仍有帖子`;
			}
			return;
		}

		dispatch('updateBoards');
		closeDialog();
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
			const res = await fetch(`/manage/removeBoard/${boardId}`, {
				headers
			}).then((r) => r.json());
			return res;
		}
	});
</script>

<div
	class="fixed z-10 inset-0 bg-black/20 dark:bg-white/20 flex justify-center items-center {showStyle}"
>
	<div class="relative bg-sky-100 dark:bg-sky-900 rounded-md p-4 min-w-[20em]">
		<button class="absolute right-2 top-2" on:click={closeDialog}>
			<CloseIcon />
		</button>
		<h1 class="text-2xl">确认删除</h1>
		<div class="mt-4">
			<span>确认删除版块: {boardName}</span>
		</div>
		<div class="mt-4 flex justify-end items-center gap-2">
			{#if errorText != null}
				<span
					class="rounded-md border
                border-red-600 dark:border-red-300
                text-red-600 dark:text-red-300
                px-1">{errorText}</span
				>
			{/if}
			<button
				class="rounded-md bg-sky-200/70 hover:bg-sky-200
				dark:bg-sky-700/80 dark:hover:bg-sky-700 px-4 py-1"
				disabled={$deleteMutation.isPending}
				on:click={confirmDelete}
			>
				{#if $deleteMutation.isPending}
					<LoadingIcon size="1.25em" />
				{:else}
					<CheckIcon />
				{/if}
			</button>
		</div>
	</div>
</div>
