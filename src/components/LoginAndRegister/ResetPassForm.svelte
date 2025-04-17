<script>
	import { createMutation } from '@tanstack/svelte-query';

	import FormTitle from './FormTitle.svelte';
	import TextInput from './TextInput.svelte';
	import SecretTextInput from './SecretTextInput.svelte';
	import PrimaryButton from './PrimaryButton.svelte';
	import AlertMessage from '$cmpns/AlertMessage.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let stage = 'reset';
	let username = null;
	let resetCode = null;

	let password = null;
	let confirm = null;

	let err = {
		password: null,
		confirm: null,
		server: {
			type: null,
			message: null
		}
	};

	$: toRightClass = stage == 'reset' ? '' : 'translate-x-[-100%]';

	const resetSubmit = async () => {
		if (password == null || password == '') {
			err.password = '密码不能为空';
			return;
		}

		if (confirm == null || confirm == '') {
			err.confirm = '确认密码不能为空';
			return;
		}

		if (password != confirm) {
			err.password = '密码和确认不一致';
			return;
		}
		const res = await $resetMutation.mutateAsync();

		if (res.type != 'ok') {
			return;
		}

		err.server = {
			type: 'success',
			message: '密码重置成功，5秒后请重新登录'
		};

		setTimeout(() => {
			err = {
				password: null,
				confirm: null,
				server: {
					type: null,
					message: null
				}
			};
			dispatch('resetOK');
		}, 5000);
	};

	const resetMutation = createMutation({
		mutationFn: async () => {
			const res = await fetch('/user/resetPassword', {
				method: 'POST',
				body: JSON.stringify({
					username,
					reset_code: resetCode,
					password
				})
			}).then((r) => r.json());

			return res;
		}
	});

	// 输入内容
	const handleInput = (dst, value) => {
		if (dst == 'confirm') {
			err.confirm = null;
			confirm = value;
		} else if (dst == 'password') {
			err.password = null;
			password = value;
		}
	};

	// 填入额外信息
	export const addExtraInfo = (extra) => {
		username = extra.username;
		resetCode = extra.resetCode;
	};
</script>

<div class="w-full shrink-0 {toRightClass} transition-all duration-500">
	<FormTitle type="reset" />
	<div class="w-full flex flex-col items-center">
		<div class="w-[20em] flex flex-col">
			<TextInput label="用户名" readonly={true} value={username} />
			<SecretTextInput
				label="新的密码"
				error={err.password}
				on:input={(e) => handleInput('password', e.detail)}
			/>

			<SecretTextInput
				label="确认密码"
				error={err.confirm}
				on:input={(e) => handleInput('confirm', e.detail)}
			/>
			<div class="mt-4"></div>
			<PrimaryButton btnText="重设密码" disable={$resetMutation.isPending} on:click={resetSubmit} />
		</div>
	</div>
	{#if err.server.type != null}
		<div class="mt-8"></div>
		<AlertMessage type={err.server.type} message={err.server.message} />
	{/if}
</div>
