<script>
	import { userStore } from '../../store/userStore';
	import { createMutation } from '@tanstack/svelte-query';

	import CheckIcon from '$svgIcon/check.svelte';
	import CloseIcon from '$svgIcon/close.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let commentInfo = {
		id: null,
		content: null
	};

	export const openDialog = ({ id, content }) => {
		commentInfo = {
			id,
			content
		};
		open = true;
	};

	const closeDialog = () => {
		commentInfo = {
			id: null,
			content: null
		};
		open = false;
	};

	let open = false;
	$: showStyle = open ? 'block' : 'hidden';

	let errorText = null;

	const removeCommentMutation = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}
			const res = await fetch(`/manage/removeComment/${commentInfo.id}`, {
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

			dispatch('delete', { id: commentInfo.id });
			closeDialog();
		}
	});
	
</script>

<div
	class="fixed inset-0 bg-black/20 dark:bg-white/20 z-10 {showStyle} flex justify-center items-center"
>
	<div class="relative min-w-[30em] bg-sky-100 dark:bg-sky-800 rounded-md px-6 py-2">
		<h1 class="py-2 text-2xl">删除评论</h1>
		<button class="absolute right-4 top-4" on:click={closeDialog}>
			<CloseIcon />
		</button>
		<div class="flex flex-col gap-2">
			<span>是否删除评论ID为 {commentInfo.id} 的评论？</span>
			<fieldset class="border-2 border-slate-400 px-2 rounded-md">
				<legend class="px-1">部分内容</legend>
				<textarea
					class="w-full resize-none rounded-md bg-sky-200/50 dark:bg-slate-700 px-2 py-1 outline-none"
					rows="4"
					readonly>{commentInfo.content}</textarea
				>
			</fieldset>
		</div>
		<div class="flex justify-end items-center gap-2 my-4">
			{#if errorText != null}
				<span
					class="border border-red-400 dark:border-red-400 text-red-400 dark:text-red-400 px-2 rounded-md"
					>{errorText}</span
				>
			{/if}
			<button
				class="bg-sky-200 px-2 py-1 rounded-md"
				on:click={() => {
					$removeCommentMutation.mutate();
				}}
			>
				{#if $removeCommentMutation.isPending}
					<LoadingIcon size="1.25em" />
				{:else}
					<CheckIcon />
				{/if}
			</button>
		</div>
	</div>
</div>
