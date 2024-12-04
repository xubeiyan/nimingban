<script>
	import CloseBtn from './Dialog/CloseBtn.svelte';
	import TextInput from './UserProfile/TextInput.svelte';
	import PasswordInput from './UserProfile/PasswordInput.svelte';
	import InputLabel from './UserProfile/InputLabel.svelte';

	import CheckIcon from '$svgIcon/check.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';

	import { userStore } from '../store/userStore';
	import { createMutation } from '@tanstack/svelte-query';

	let show = false;

	export const openDialog = () => {
		show = true;
	};

	const closeDialog = () => {
		form = {
			oldPass: '',
			newPass: '',
			confirm: ''
		};

		error = null;
		success = null;
		show = false;
	};

	let form = {
		oldPass: '',
		newPass: '',
		confirm: ''
	};

	let error = null;
	let success = null;

	// 更新提交值
	const updateInput = (label, value) => {
		if (label == 'oldPass') {
			form.oldPass = value;
		} else if (label == 'newPass') {
			form.newPass = value;
		} else if (label == 'confirm') {
			form.confirm = value;
		}
	};

	const changePassMutation = createMutation({
		mutationFn: async () => {
			const { oldPass, newPass } = form;
			// 有userStore.token字段则附上
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}
			const res = await fetch('/user/updatePassword', {
				method: 'POST',
				body: JSON.stringify({
					oldPass,
					newPass
				}),
				headers
			}).then((r) => r.json());

			return res;
		}
	});

	// 修改密码
	const changePassSubmit = async () => {
		error = null;
		success = null;
		if (form.oldPass == '') {
			error = '旧密码不能为空';
			return;
		}

		if (form.newPass == '' || form.confirm == '') {
			error = '新密码或者确认密码不能为空';
			return;
		}

		if (form.newPass != form.confirm) {
			error = '两次新密码不一致';
			return;
		}

		const res = await $changePassMutation.mutateAsync();

		if (res.type != 'ok') {
			if (res.errorCode == 'NO_SUCH_USER') {
				error = '找不到此用户信息';
			} else if (res.errorCode == 'OLD_PASSWORD_WRONG') {
				error = '旧密码不正确';
			} else if (res.errorCode == 'NEW_PASSWORD_TOO_SHORT') {
				error = '新密码太短了';
			} else if (res.errorCode == 'NO_AUTHORIZATION_HEADER') {
				error = '修改密码需要登录';
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				error = '认证字段不正确';
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				error = '需要重新登录';
			}
			return;
		}

		success = '修改成功';
	};

	$: showStyle = show ? '' : 'translate-y-[-100%]';
	$: userTypeText =
		$userStore.type == 'admin' ? '管理员' : $userStore.type == 'user' ? '普通用户' : '受限用户';
</script>

<div
	class="fixed inset-0 z-20 flex justify-center items-center {showStyle} transition duration-200
     bg-slate-800/20 dark:bg-slate-50/20 backdrop-blur-sm"
>
	<div class="rounded-md relative bg-slate-200 dark:bg-sky-800 p-10 dark:text-white">
		<CloseBtn place="onBorder" on:click={closeDialog} />
		<form class="space-y-4">
			<fieldset class="border border-sky-600 dark:border-sky-200 rounded-md p-2">
				<legend class="px-2">用户信息</legend>
				<div class="grid grid-cols-2 px-4 py-2 gap-4">
					<div class="space-x-1">
						<InputLabel>用户名</InputLabel>
						<TextInput readonly value={$userStore.username} />
					</div>
					<div class="space-x-1">
						<InputLabel>用户类型</InputLabel>
						<TextInput readonly value={userTypeText} />
					</div>
					<div class="space-x-1">
						<InputLabel>注册时间</InputLabel>
						<TextInput readonly value={$userStore.createTime} />
					</div>
				</div>
			</fieldset>
			<fieldset class="border border-sky-600 dark:border-sky-200 rounded-md p-2">
				<legend class="px-2">密码修改</legend>
				<div class="grid grid-cols-1 gap-2 px-4 py-2">
					<label for="oldpass" class="space-x-1 flex">
						<InputLabel>旧密码</InputLabel>
						<PasswordInput
							value={form.oldPass}
							label="oldpass"
							on:input={(e) => updateInput('oldPass', e.target.value)}
						/>
					</label>
					<label for="newpass" class="space-x-1 flex">
						<InputLabel>新密码</InputLabel>
						<PasswordInput
							value={form.newPass}
							label="newpass"
							on:input={(e) => updateInput('newPass', e.target.value)}
						/>
					</label>
					<label for="confirm" class="space-x-1 flex">
						<InputLabel>确认密码</InputLabel>
						<PasswordInput
							value={form.confirm}
							label="confirm"
							on:input={(e) => updateInput('confirm', e.target.value)}
						/>
					</label>
				</div>
				<div class="flex justify-end items-center mt-4 gap-2">
					{#if error != null}
						<span class="text-red-500 dark:text-red-400">{error}</span>
					{/if}
					{#if success != null}
						<span class="text-green-500">{success}</span>
					{/if}
					<button
						type="button"
						class="rounded-md
                    bg-slate-300 hover:bg-slate-400
                    dark:bg-sky-600 dark:hover:bg-sky-500
                    px-3 py-1"
						on:click={changePassSubmit}
					>
						{#if $changePassMutation.isPending}
							<LoadingIcon />
						{:else}
							<CheckIcon />
						{/if}
					</button>
				</div>
			</fieldset>
		</form>
	</div>
</div>
