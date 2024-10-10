<script>
	import { createEventDispatcher } from 'svelte';
	import FormTitle from './FormTitle.svelte';
	import SecretTextInput from './SecretTextInput.svelte';
	import PrimaryButton from './PrimaryButton.svelte';
	import TextInput from './TextInput.svelte';
	import AlertMessage from '../AlertMessage.svelte';

	export let toRight = false;
	$: toRightClass = toRight ? 'translate-x-[-100%]' : '';

	let username = '';
	let password = '';

	const handlePasswordInput = (e) => {
		err.password = null;
		password = e.detail;
	};

	const handleUsernameInput = (e) => {
		err.username = null;
		username = e.target.value;
	};

	let err = {
		username: null,
		password: null,
		server: '用户名或密码错误'
	};

	const dispatch = createEventDispatcher();

	const toRegisterForm = () => {
		dispatch('toggleToRight');
	};

	const loginSubmit = () => {
		if (username == '') {
			err.username = '用户名不能为空';
		}

		if (password == '') {
			err.password = '密码不能为空';
		}

		if (err.username != null || err.password != null) {
			return;
		}

		console.log(username, password);
	};
</script>

<div class="w-full shrink-0 {toRightClass} transition-all duration-500">
	<FormTitle type="login" />
	<div class="w-full flex flex-col items-center">
		<div class="w-[20em] flex flex-col">
			<TextInput label="用户名" on:input={handleUsernameInput} />
			<SecretTextInput label="密码" error={err.password} on:input={handlePasswordInput} />
			<div class="mt-4"></div>
			<PrimaryButton btnText="登录" on:click={loginSubmit} />
		</div>
	</div>
	<div class="flex justify-center mt-1">
		<button on:click={toRegisterForm}>
			<span class="text-blue-400 dark:text-blue-100 hover:underline underline-offset-4">
				没有帐号？点击注册
			</span>
		</button>
	</div>
	{#if err.server != null}
        <div class="mt-4"></div>
		<AlertMessage type="error" message={err.server} />
	{/if}
</div>
