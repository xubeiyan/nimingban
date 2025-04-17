<script>
	import { userStore } from '../../../store/userStore';
	import { refreshToken } from '$lib/refreshToken';
	import { createEventDispatcher } from 'svelte';

	import { createMutation } from '@tanstack/svelte-query';

	const dispatch = createEventDispatcher();
	export let id = null;
	export let needReset = true;

	$: bgStyle = needReset
		? 'bg-violet-200/80 hover:bg-violet-200 dark:bg-violet-500/80 hover:dark:bg-violet-500'
		: 'bg-rose-200/80 hover:bg-rose-200 dark:bg-rose-600/80 hover:dark:bg-rose-600';
	// 错误信息
	let errorText = null;

	// 将用户设置为重置密码状态
	const resetUserPass = async () => {
		errorText = null;
		if (id == null) return;
		const res = await $resetPassMutation.mutateAsync();

		if (res.type != 'ok') {
			errorText = '重置失败';
			return;
		}

		dispatch('updateUserList', {
			id: res.user.id,
			tempPass: res.user.temp_pass
		});
	};

	const resetPassMutation = createMutation({
		mutationFn: async (user_id) => {
			let headers = {};

			// 有userStore.token字段则附上
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);
			const res = await fetch('/manage/resetPassword', {
				method: 'POST',
				body: JSON.stringify({
					user_id: id
				}),
				headers
			}).then((r) => r.json());

			return res;
		}
	});
</script>

<button
	class="rounded-md flex items-center
    {bgStyle} px-2 py-0.5"
	disabled={$resetPassMutation.isPending || errorText != null}
	on:click={resetUserPass}
>
	{errorText != null ? errorText : needReset ? '重置密码' : '取消重置'}
</button>
