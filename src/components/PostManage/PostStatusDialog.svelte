<script>
	import { userStore } from '../../store/userStore';

	import PostStatusSelect from './PostStatusSelect.svelte';

	import { refreshToken } from '$lib/refreshToken';

	import CloseIcon from '$svgIcon/close.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
	import CheckIcon from '$svgIcon/check.svelte';
	import { createMutation } from '@tanstack/svelte-query';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let open = false;
	$: showStyle = open ? '' : 'hidden';

	let post = {
		id: null,
		content: null,
		status: null
	};

	let errorText = null;

	export const openDialog = ({ id, content, status }) => {
		post = {
			id,
			content,
			status
		};
		open = true;
	};

	const closeDialog = () => {
		post = {
			id: null,
			content: null,
			status: null
		};
		open = false;
	};

	const modify = async () => {
		const res = await $modifyMutation.mutateAsync();

		if (res.type != 'ok') {
			if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				errorText = '当前用户不允许此操作';
			} else if (res.errorCode == 'NO_AUTHORIZATION_HEADER') {
				errorText = `没有认证字段`;
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				errorText = `认证字段不正确`;
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				errorText = `需要退出后重新登录`;
			} else if (res.errorCode == 'CHANGE_STATUS_NOT_FOUND') {
				errorText = `未读取到修改状态字段`;
			} else if (res.errorCode == 'INVALID_STATUS') {
				errorText = `不支持的修改状态`;
			} else if (res.errorCode == 'NOT_AFFECT_ROWS') {
				errorText = `没有更新内容`;
			}
			return;
		}

		dispatch('update', { id: post.id, status: post.status });
		closeDialog();
	};

	const modifyMutation = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);
			const res = await fetch(`/manage/editPostStatus/${post.id}`, {
				headers,
				method: 'POST',
				body: JSON.stringify({
					id: post.id,
					status: post.status
				})
			}).then((r) => r.json());
			return res;
		}
	});
</script>

<div
	class="fixed z-10 inset-0 bg-black/20 dark:bg-white/20 {showStyle} flex justify-center items-center"
>
	<div class="relative min-w-[30em] bg-sky-100 dark:bg-sky-800 rounded-md px-6 py-2">
		<h1 class="py-2 text-2xl">修改可见性</h1>
		<button class="absolute right-4 top-4" on:click={closeDialog}>
			<CloseIcon />
		</button>
		<div class="mt-4">
			<span>修改 ID 为 {post.id} 的串的可见性</span>
		</div>
		<fieldset class="mt-1 border border-slate-400 px-2 py-1 rounded-md">
			<legend class="px-1">部分内容</legend>
			<textarea
				rows="4"
				name="part"
				class="w-full resize-none rounded-md bg-sky-200/50 dark:bg-slate-700 px-2 py-1 outline-none"
				>{post.content}</textarea
			>
		</fieldset>
		<div class="mt-2 flex flex-col gap-1">
			<span class="pl-1">可见性改为</span>
			<PostStatusSelect
				value={post.status}
				on:select={(e) => {
					post.status = e.detail;
				}}
			/>
		</div>
		<div class="flex justify-end my-4 items-center gap-2">
			{#if errorText != null}
				<span
					class="rounded-md border
                border-red-600 dark:border-red-300
                text-red-600 dark:text-red-300
                px-1">{errorText}</span
				>
			{/if}
			<button
				class="bg-sky-200/70 hover:bg-sky-200
				dark:bg-sky-600/80 dark:hover:bg-sky-600 px-2 py-1 rounded-md"
				on:click={modify}
			>
				{#if $modifyMutation.isPending}
					<LoadingIcon size="1.25em" />
				{:else}
					<CheckIcon />
				{/if}
			</button>
		</div>
	</div>
</div>
