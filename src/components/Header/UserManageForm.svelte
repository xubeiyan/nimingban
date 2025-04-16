<script>
	import { createMutation } from '@tanstack/svelte-query';

	import CloseIcon from '$svgIcon/close.svelte';

	import LabelInput from './CookiesManageForm/LabelInput.svelte';
	import SearchBtn from './CookiesManageForm/SearchBtn.svelte';

	import { userStore } from '../../store/userStore';
	import { refreshToken } from '$lib/refreshToken';
	import ResultTable from './UserManageForm/ResultTable.svelte';
	import DateInput from './UserManageForm/DateInput.svelte';

	let show = false;
	$: showStyle = show ? '' : 'translate-y-[-100%]';

	let value = {
		username: null,
		startDate: null,
		endDate: null
	};
	let userList = [];
	let errorText = null;

	export const showForm = (params) => {
		if (params != undefined) {
			const { username } = params;
			value.username = username;
			searchUser();
		}
		show = true;
	};

	export const hideForm = () => {
		show = false;
	};

	export const isHide = () => {
		return !show;
	};

	const searchUser = async () => {
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

		userList = res.result;
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
			const res = await fetch('/manage/searchUser', {
				method: 'POST',
				body: JSON.stringify({
					username: value.username,
					start_date: value.startDate,
					end_date: value.endDate
				}),
				headers
			}).then((r) => r.json());

			return res;
		}
	});

	// 处理状态更新
	const handleStatusUpdate = ({ type, id, status }) => {
		// console.log(type, id, status);
		if (type == 'user') {
			const filtered = userList.filter((u) => u.id == id);
			if (filtered.length != 1) return;
			filtered[0].status = status;
			userList = userList;
		}
	};
</script>

<div
	class="fixed z-10 inset-0 bg-slate-800/20 dark:bg-white/20 transition duration-500 {showStyle}"
>
	<div
		class="relative container mx-auto mt-[3em]
bg-sky-100 dark:bg-sky-700 rounded-md px-4 py-4"
	>
		<h1 class="text-2xl">用户管理</h1>
		<button class="absolute right-4 top-4" type="button" on:click={hideForm}>
			<CloseIcon />
		</button>

		<form class="mt-4">
			<div class="w-full flex gap-2">
				<LabelInput
					label="用户名称"
					value={value.username}
					on:input={(e) => {
						value.username = e.target.value;
					}}
					on:click={() => {
						value.username = null;
					}}
				/>
				<DateInput
					label="创建时间搜寻范围开始"
					value={value.startDate}
					on:input={(e) => {
						value.startDate = e.target.value;
					}}
					on:click={() => {
						value.startDate = null;
					}}
				/>
				<DateInput
					label="结束"
					value={value.endDate}
					on:input={(e) => {
						value.endDate = e.target.value;
					}}
					on:click={() => {
						value.endDate = null;
					}}
				/>

				<SearchBtn on:click={searchUser} />
			</div>
		</form>
		<fieldset class="border border-slate-400 dark:border-slate-300 rounded-md px-3 py-2 mt-2">
			<legend class="px-1">搜索结果</legend>
			{#if $searchMutation.isIdle}
				<span class="px-1">未进行搜索</span>
			{:else if errorText != null}
				<div class="px-1">
					<span
						class="border border-red-700 dark:border-red-300
					rounded-md text-red-700 dark:text-red-300
					px-2 py-1">{errorText}</span
					>
				</div>
			{:else if $searchMutation.isPending}
				<div class="px-1">
					<span>搜索中...</span>
				</div>
			{:else if userList.length == 0}
				<span class="px-1">什么都没找到</span>
			{:else}
				<ResultTable {userList} on:updateStatus={(e) => handleStatusUpdate(e.detail)} />
			{/if}
		</fieldset>
	</div>
</div>
