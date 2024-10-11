<script>
	import { createEventDispatcher } from 'svelte';
	import FormTitle from './FormTitle.svelte';

	import TextInput from './TextInput.svelte';
	import SecretTextInput from './SecretTextInput.svelte';
	import PrimaryButton from './PrimaryButton.svelte';

	import AlertMessage from '../AlertMessage.svelte';

	import { createMutation } from '@tanstack/svelte-query';

	export let toRight = false;
	$: toRightClass = toRight ? 'translate-x-[-100%]' : '';

	const dispatch = createEventDispatcher();

	const toLoginForm = () => {
		dispatch('toggleToRight');
	};

	let username = '';
	let password = '';
	let confirm = '';

	const handleUsernameInput = (e) => {
		err.username = null;
		username = e.target.value;
	};

	const handlePasswordInput = (e) => {
		err.password = null;
		password = e.detail;
	};

	const handleConfirmInput = (e) => {
		err.confirm = null;
		confirm = e.detail;
	};

	const registerMutation = createMutation({
		mutationFn: async () => {
			return fetch(
				'/register',
				{
					method: 'POST',
					body: JSON.stringify({
						username,
						password
					})
				},
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			).then((r) => r.json());
		}
	});

	const registerSubmit = async () => {
		err.server = {
			type: null,
			message: null
		};

		if (username == '') {
			err.username = '注册需要用户名';
		}

		if (password == '') {
			err.password = '注册需要密码';
		}

		if (confirm == '') {
			err.confirm = '请再输入一遍密码';
		}

		if (err.username != null || err.password != null || err.confirm != null) {
			return;
		}

		const res = await $registerMutation.mutateAsync();

		if (res.type == 'error' && res.errorCode == 'USER_NAME_EXISTS') {
			err.server = {
				type: 'error',
				message: '此用户名已经存在'
			};
			return;
		}

		if (res.type == 'warning') {
			err.server = {
				type: 'warning',
				message: res.errorCode
			};
			return;
		}

		if (res.type == 'OK') {
			err.server = {
				type: 'success',
				message: '注册成功，即将跳转到登录页面.'
			};

			let time = 0;

			const handler = () => {
				time += 1;
				err.server.message += '.';

				if (time > 5) {
					err.server = {
						type: null,
						message: null
					};
					toLoginForm();
					return;
				}

				setTimeout(handler, 1000);
			};
            
			handler();
		}
	};

	$: btnText = $registerMutation.isPending ? '注册中...' : '注册';

	let err = {
		username: null,
		password: null,
		confirm: null,
		server: {
			type: null,
			message: null
		}
	};
</script>

<div class="w-full shrink-0 {toRightClass} transition-all duration-500">
	<FormTitle type="register" />
	<div class="w-full flex flex-col items-center">
		<div class="w-[20em] flex flex-col">
			<TextInput label="用户名" on:input={handleUsernameInput} error={err.username} />
			<SecretTextInput label="密码" error={err.password} on:input={handlePasswordInput} />
			{#if password != ''}
				<SecretTextInput label="确认密码" error={err.confirm} on:input={handleConfirmInput} />
			{/if}
			<div class="mt-4"></div>
			<PrimaryButton {btnText} disable={$registerMutation.isPending} on:click={registerSubmit} />
		</div>
		<button class="mt-2" on:click={toLoginForm}>
			<span class="text-blue-400 dark:text-blue-100 hover:underline underline-offset-4">
				已有帐号？点击登录
			</span>
		</button>
	</div>
	{#if err.server.type != null}
		<div class="mt-8"></div>
		<AlertMessage type={err.server.type} message={err.server.message} />
	{/if}
</div>
