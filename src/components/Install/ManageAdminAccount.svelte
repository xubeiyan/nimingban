<script>
	import { createMutation } from '@tanstack/svelte-query';

	import { onMount } from 'svelte';

	import InputLabel from './ReadonlyInputLabel.svelte';
	import LabelInput from './LabelInput.svelte';
	import DeleteUserBtn from './DeleteUserBtn.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let manageStatus = 'idle';

	let users = [];

	const fetchUsers = createMutation({
		mutationFn: async () => {
			const res = await fetch('/install/manageAdmin/getAccounts').then((r) => r.json());
			if (res.type == 'ok') {
				users = res.users;
			}
		}
	});

	let toAddUser = {
		username: null,
		password: null,
		confirm: null
	};

	let errorText = null;

	// 检查用户名和密码和确认密码
	const checkInput = () => {
		if (toAddUser.username == null || toAddUser.username == '') {
			errorText = `用户名字段是空的`;
			return;
		}

		if (toAddUser.password == null || toAddUser.password == '') {
			errorText = `密码字段是空的`;
			return;
		}

		if (toAddUser.confirm == null || toAddUser.confirm == '') {
			errorText = `确认密码字段是空的`;
			return;
		}

		if (toAddUser.password != toAddUser.confirm) {
			errorText = `密码和确认密码不一致，密码为${toAddUser.password}，确认密码为${toAddUser.confirm}`;
			return;
		}

		if (
			!/\d/.test(toAddUser.password) ||
			!/[A-Z]/.test(toAddUser.password) ||
			!/[a-z]/.test(toAddUser.password)
		) {
			errorText = `密码必须包含至少一个大写字母，一个小写字母，一个数字。当前密码为${toAddUser.password}`;
		}

		return 'pass';
	};

	const addUser = createMutation({
		mutationFn: async () => {
			errorText = null;
			if (checkInput() != 'pass') return;

			const res = await fetch('/install/manageAdmin/addUser', {
				method: 'POST',
				body: JSON.stringify({
					username: toAddUser.username,
					password: toAddUser.password
				})
			}).then((r) => r.json());

			if (res.type == 'error') {
				if (res.errorCode == 'USERNAME_DUPLICATE') {
					errorText = '用户名重复';
				} else if (res.errorCode == 'MISS_USERNAME_OR_PASSWORD') {
					errorText = '用户名或密码为空';
				}
				return;
			}

			$fetchUsers.mutate();
		}
	});

	const complete = () => {
		dispatch('stageChange', { to: 'board_param' });
		manageStatus = 'success';
	};

	$: addUserBtnText = $addUser.isPending ? '请求中...' : '新增';

	$: manageStatusStyle = manageStatus == 'success' ? 'hidden' : '';

	// 处理删除成功操作
	const handleDeleteSuccess = ({ id }) => {
		users = users.filter((u) => u.id != id);
	};

	onMount(() => {
		$fetchUsers.mutate();
	});
</script>

<div
	class="mt-2 rounded-md bg-slate-200 dark:bg-sky-700 px-4 py-2 flex justify-between items-center"
>
	<h1 class="text-xl">管理员配置</h1>
	{#if manageStatus == 'success'}
		<span class="text-green-600 dark:text-green-400">配置完成</span>
	{/if}
</div>
<div
	class="mt-2 rounded-md shadow-inner dark:shadow-sky-800
        bg-slate-100 dark:bg-sky-800
        px-4 py-4 {manageStatusStyle}"
>
	{#if $fetchUsers.isPending}
		<span>获取中...</span>
	{:else if $fetchUsers.isSuccess && users.length == 0}
		<span>没有管理用户</span>
	{:else if users.length > 0}
		<div class="bg-slate-400/20 dark:bg-slate-100/20 grid grid-cols-3">
			<span class="px-2 py-0.5 rounded-l-md">用户名</span>
			<span class="py-0.5">创建时间</span>
			<span class="py-0.5 rounded-r-md">操作</span>
		</div>

		{#each users as u}
			<div class="odd:bg-slate-300/20 dark:odd:bg-slate-200/10 grid grid-cols-3">
				<span class="px-2 py-1">{u.username}</span>
				<span class="py-1">{u.create_time}</span>
				<span class="py-1">
					<DeleteUserBtn id={u.id} on:deleteSuccess={(e) => handleDeleteSuccess(e.detail)} />
				</span>
			</div>
		{/each}
	{/if}
	<form class="mt-2">
		<fieldset
			class="border border-slate-400 dark:border-slate-400 px-2 pt-1 pb-2 {manageStatusStyle}"
		>
			<legend class="px-1">新增用户</legend>
			<div class="grid grid-cols-3 gap-2 mx-1">
				<LabelInput
					label="用户名"
					on:input={(e) => {
						toAddUser.username = e.target.value;
					}}
				/>
				<LabelInput
					label="密码"
					type="password"
					on:input={(e) => {
						toAddUser.password = e.target.value;
					}}
				/>
				<LabelInput
					label="确认密码"
					type="password"
					on:input={(e) => {
						toAddUser.confirm = e.target.value;
					}}
				/>
			</div>
			<div class="mt-4 mx-1 flex justify-end gap-2">
				{#if errorText != null}
					<span
						class="rounded-md border border-red-600 dark:border-red-400
					 px-2 py-0.5 text-red-600 dark:text-red-400">{errorText}</span
					>
				{/if}
				<button
					class="rounded-md bg-indigo-200 dark:bg-indigo-600 px-2 py-0.5"
					disabled={$addUser.isPending}
					on:click={() => $addUser.mutate()}>{addUserBtnText}</button
				>
			</div>
		</fieldset>
	</form>
	{#if users.length > 0}
		<div class="flex justify-end mt-2">
			<button class="rounded-md bg-sky-200 dark:bg-sky-600 px-2 py-0.5" on:click={complete}
				>完成管理员配置</button
			>
		</div>
	{/if}
</div>
