<script>
	import CloseIcon from '$svgIcon/close.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
	import CheckIcon from '$svgIcon/check.svelte';
	import { createMutation } from '@tanstack/svelte-query';

	import { refreshToken } from '$lib/refreshToken';

	import { userStore } from '../../store/userStore';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let deletePost = {
		id: null,
		content: null
	};

	let errorText = null;

	export const openDialog = ({ id, content }) => {
		deletePost = {
			id,
			content
		};
		open = true;
	};

	const closeDialog = () => {
		deletePost = {
			id: null,
			content: null
		};
		open = false;
	};

	const confirmDelete = () => {
		if (deletePost.id == null) return;
		const res = $deleteMutation.mutateAsync(deletePost.id);

		if (res.type != 'ok') {
			if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				errorText = '当前用户不允许此操作';
			} else if (res.errorCode == 'NO_AUTHORIZATION_HEADER') {
				errorText = `没有认证字段`;
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				errorText = `认证字段不正确`;
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				errorText = `需要退出后重新登录`;
			} else if (res.errorCode == 'SUCH_POST_NOT_EXIST') {
				errorText = `未找到对应ID的串`;
			}
		}
		dispatch('deletePost', {
			id: deletePost.id
		});

		closeDialog();

	};

	const deleteMutation = createMutation({
		mutationFn: async (id) => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);
			const res = await fetch(`/manage/removePost/${id}`, {
				headers
			}).then((r) => r.json());
			return res;
		}
	});

	let open = false;
	$: showStyle = open ? '' : 'hidden';
	$: rows = () => {
		if (deletePost.content == null) return 2;
		return deletePost.content.split('\n').length + 1;
	};
</script>

<div
	class="fixed z-10 inset-0 bg-black/20 dark:bg-white/20 flex justify-center items-center {showStyle}"
>
	<div class="relative bg-sky-100 dark:bg-sky-900 rounded-md p-4 min-w-[30em] shadow-sm">
		<button class="absolute right-2 top-2" on:click={closeDialog}>
			<CloseIcon />
		</button>
		<h1 class="text-2xl">确认删除</h1>
		<div class="mt-4">
			<span>确认删除ID为 {deletePost.id} 的串和它的所有回复？</span>
		</div>
		<fieldset class="mt-1 border border-slate-400 px-2 py-1 rounded-md">
			<legend class="px-1">部分内容</legend>
			<textarea
				rows={rows()}
				class="w-full resize-none rounded-md
                bg-sky-200/50 dark:bg-slate-700 px-2 py-1 outline-none"
				>{deletePost.content}</textarea
			>
		</fieldset>
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
				dark:bg-sky-700/80 dark:hover:bg-sky-700 px-2 py-1"
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
