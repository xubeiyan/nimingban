<script>
	import { userStore } from '../../../store/userStore';

	import CheckIcon from '$svgIcon/check.svelte';
	import CloseIcon from '$svgIcon/close.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
	import { createMutation } from '@tanstack/svelte-query';

	import { refreshToken } from '$lib/refreshToken';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let section = {
		id: null,
		name: null
	};

	let errorText = null;

	export const openDialog = ({ id, name }) => {
		section = {
			id,
			name
		};

		open = true;
	};

	const closeDialog = () => {
		section = {
			id: null,
			name: null
		};
		open = false;
	};

	let open = false;

	const confirmDelete = async () => {
		const res = await $deleteMutation.mutateAsync();

		if (res.type != 'ok') {
			if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				errorText = '当前用户不允许此操作';
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				errorText = `认证字段不正确`;
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				errorText = `需要退出后重新登录`;
			} else if (res.errorCode == 'SECTION_EXIST_BOARD') {
				errorText = `分区中有板块不能删除`;
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

			const res = await fetch(`/manage/removeSection/${section.id}`, {
				headers
			}).then((r) => r.json());

			return res;
		}
	});

	$: showStyle = open ? '' : 'hidden';
</script>

<div
	class="fixed inset-0 z-10 bg-black/20 dark:bg-white/20 {showStyle} flex justify-center items-center"
>
	<div class="relative bg-sky-100 dark:bg-sky-900 rounded-md p-4 min-w-[30em] shadow-md">
		<h1 class="text-2xl">确认删除</h1>
		<button class="absolute right-2 top-2" on:click={closeDialog}>
			<CloseIcon />
		</button>
		<div class="mt-4">
			<span>确认删除分区: {section.name}</span>
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
