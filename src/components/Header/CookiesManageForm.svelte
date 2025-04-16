<script>
	import CloseIcon from '$svgIcon/close.svelte';
	import SearchIcon from '$svgIcon/search.svelte';

	import LabelInput from './CookiesManageForm/LabelInput.svelte';
	import ResultTable from './CookiesManageForm/ResultTable.svelte';

	import { refreshToken } from '$lib/refreshToken';
	import { userStore } from '../../store/userStore';

	import { cookieManageStore } from '../../store/cookieManageStore';
	import { createMutation } from '@tanstack/svelte-query';

	import { onDestroy } from 'svelte';
	import SearchBtn from './CookiesManageForm/SearchBtn.svelte';

	let show = false;
	$: showStyle = show ? '' : 'translate-y-[-100%]';

	export const showForm = () => {
		show = true;
	};

	export const hideForm = () => {
		show = false;
	};

	export const isHide = () => !show;

	let cookiesList = [];
	let errorText = null;
	const cookieSearch = async () => {
		errorText = null;
		const res = await $searchMutation.mutateAsync();
		if (res.type != 'ok') {
			if (res.errorCode == 'THIS_COOKIE_NOT_VALID') {
				errorText = '“神秘饼干”不是合理的饼干';
			} else if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				errorText = '当前用户不允许此操作';
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				errorText = `认证字段不正确`;
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				errorText = `需要退出后重新登录`;
			}

			return;
		}

		cookiesList = res.result;
	};

	const searchMutation = createMutation({
		mutationFn: async () => {
			let headers = {};

			// 有userStore.token字段则附上
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);

			const res = await fetch('/manage/searchCookies', {
				method: 'POST',
				body: JSON.stringify({
					username: $cookieManageStore.username,
					cookie: $cookieManageStore.cookie
				}),
				headers
			}).then((r) => r.json());

			return res;
		}
	});

	// 处理编辑搜索框
	const handleEditSearch = ({ type, value }) => {
		if (type == 'username') {
			cookieManageStore.update((c) => ({
				username: value,
				cookie: null
			}));
		}
	};

	// 处理状态更新
	const handleStatusUpdate = ({ type, id, status }) => {
		// console.log(type, id, status);
		if (type == 'user') {
			const filtered = cookiesList.filter((c) => c.user_id == id);
			filtered.forEach((one) => {
				one.user_status = status;
			});
			cookiesList = cookiesList;
		} else if (type == 'cookie') {
			const filtered = cookiesList.filter((c) => c.cookie_id == id);
			if (filtered.length != 1) return;
			filtered[0].cookie_status = status;
			cookiesList = cookiesList;
		}
	};

	const unsubscribe = cookieManageStore.subscribe((c) => {
		if (c.cookie != null || c.username != null) {
			showForm();
			cookieSearch();
		}
	});

	onDestroy(unsubscribe);
</script>

<div
	class="fixed inset-0 z-10 bg-slate-800/20 dark:bg-white/20 transition duration-500 {showStyle} "
>
	<div class="relative container mx-auto mt-[3em] bg-sky-100 dark:bg-sky-700 rounded-md px-4 py-4">
		<h1 class="text-2xl">饼干管理</h1>
		<button class="absolute right-4 top-4" type="button" on:click={hideForm}>
			<CloseIcon />
		</button>
		<form class="mt-4">
			<div class="flex gap-2">
				<LabelInput
					label="用户名称"
					value={$cookieManageStore.username}
					on:input={(e) => {
						$cookieManageStore.username = e.target.value;
					}}
					on:click={() => {
						$cookieManageStore.username = null;
					}}
				/>
				<LabelInput
					label="饼干名称"
					value={$cookieManageStore.cookie}
					on:input={(e) => {
						$cookieManageStore.cookie = e.target.value;
					}}
					on:click={() => {
						$cookieManageStore.cookie = null;
					}}
				/>
				<SearchBtn on:click={cookieSearch} />
			</div>
		</form>
		<fieldset class="border border-slate-400 dark:border-slate-300 rounded-md px-3 py-1 mt-2">
			<legend class="px-1">搜索结果</legend>
			{#if $searchMutation.isIdle}
				<div class="mb-2 px-1">未进行搜索</div>
			{:else if errorText != null}
				<div class="mb-2 px-1">
					<span
						class="border border-red-700 dark:border-red-300
					rounded-md text-red-700 dark:text-red-300
					px-2 py-1">{errorText}</span
					>
				</div>
			{:else if $searchMutation.isPending}
				<div class="mb-2 px-1">
					<span>搜索中...</span>
				</div>
			{:else if cookiesList.length == 0}
				<div class="mb-2 px-1">什么都没找到</div>
			{:else}
				<ResultTable
					{cookiesList}
					on:editSearch={(e) => handleEditSearch(e.detail)}
					on:updateStatus={(e) => handleStatusUpdate(e.detail)}
					on:searchUser
				/>
			{/if}
		</fieldset>
	</div>
</div>
