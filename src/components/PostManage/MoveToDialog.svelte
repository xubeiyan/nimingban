<script>
	import CloseIcon from '$svgIcon/close.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';

	import SearchSelect from '$cmpns/SearchSelect.svelte';

	import { createMutation } from '@tanstack/svelte-query';

	import { refreshToken } from '$lib/refreshToken';

	import { userStore } from '../../store/userStore';

	let boardList = [];
	let errorText = null;
	let postId = null;

	let open = false;
	$: showStyle = open ? '' : 'hidden';

	export const openDialog = ({ id }) => {
		open = true;
		postId = id;
		$getBoardListMutation.mutate();
	};

	// 获取所有的版面名称
	const getBoardListMutation = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);
			const res = await fetch('/manage/movePost/getFullBoardList', {
				headers
			}).then((r) => r.json());

			if (res.type != 'ok') {
				if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
					errorText = '当前用户不允许此操作';
				} else if (res.errorCode == 'NO_AUTHORIZATION_HEADER') {
					errorText = `没有认证字段`;
				} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
					errorText = `认证字段不正确`;
				} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
					errorText = `需要退出后重新登录`;
				}

				return;
			}

			boardList = res.forums.map((one) => ({
				label: `${one.board_name} - ${one.section_name}`,
				value: `${one.id}`
			}));
		}
	});

	const closeDialog = () => {
		open = false;
		boardList = [];
	};

	let selectBoradId = null;
	// 选择移动到的版块
	const handleBoardSelect = ({ id }) => {
		selectBoradId = id;
	};

	// 移动到特定板块
	const movePostMuation = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);

			const res = await fetch('/manage/movePost', {
				method: 'POST',
				body: JSON.stringify({
					post_id: postId,
          to_board_id: selectBoradId,
				}),
				headers
			}).then((r) => r.json());

			if (res.type != 'ok') {
				if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
					errorText = '当前用户不允许此操作';
				} else if (res.errorCode == 'NO_AUTHORIZATION_HEADER') {
					errorText = `没有认证字段`;
				} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
					errorText = `认证字段不正确`;
				} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
					errorText = `需要退出后重新登录`;
				} else if (res.errorCode == 'INVAILD_POST_ID') {
					errorText = `未提供串ID`;
				} else if (res.errorCode == 'INVAILD_TO_BOARD_ID') {
					errorText = `未提供移动至版块ID`;
				}

				return;
			}

      closeDialog();
		}
	});
</script>

<div
	class="fixed z-10 inset-0 bg-black/20 dark:bg-white/20 flex justify-center items-center {showStyle}"
>
	<div class="relative bg-sky-100 dark:bg-sky-900 rounded-md p-4 min-w-[30em] shadow-sm">
		<button class="absolute right-2 top-2" on:click={closeDialog}>
			<CloseIcon />
		</button>
		<h1 class="text-2xl">移动串</h1>
		<fieldset class="mt-1 border border-slate-400 px-2 py-1 rounded-md">
			<legend class="px-1">移动此串至...</legend>
			<SearchSelect
				placeholder={errorText == null ? '输入版块名称查找' : errorText}
				isPending={$getBoardListMutation.isPending}
				options={boardList}
				on:select={(e) => handleBoardSelect(e.detail)}
			/>
		</fieldset>

		<div class="flex gap-2 items-center justify-end mt-4">
			{#if errorText != null}
				<span
					class="rounded-md border
            border-red-600 dark:border-red-300
            text-red-600 dark:text-red-300
            px-1">{errorText}</span
				>
			{/if}
			<button
				disabled={selectBoradId == null || $movePostMuation.isPending}
				class="rounded-md bg-sky-200/70 hover:bg-sky-200
				dark:bg-sky-700/80 dark:hover:bg-sky-700 px-2 py-1"
				on:click={() => $movePostMuation.mutateAsync()}
			>
				{#if $movePostMuation.isPending}
					<LoadingIcon size="1.5em" />
				{:else}
					确认
				{/if}</button
			>
		</div>
	</div>
</div>
