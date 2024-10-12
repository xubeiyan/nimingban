<script>
	import { createEventDispatcher } from 'svelte';
	import FormTitle from './FormTitle.svelte';

	import TextInput from './TextInput.svelte';
	import SecretTextInput from './SecretTextInput.svelte';
	import PrimaryButton from './PrimaryButton.svelte';

	import AlertMessage from '../AlertMessage.svelte';

	import { createMutation } from '@tanstack/svelte-query';
	import AddPlus from '$svgIcon/addPlus.svelte';

	import { userStore } from '../../store/userStore';

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
		server: {
			type: null,
			message: null
		}
	};

	const dispatch = createEventDispatcher();

	const toRegisterForm = () => {
		dispatch('toggleToRight');
	};

	const loginSubmit = async () => {
		err.server = {
			type: null,
			message: null
		};

		if (username == '') {
			err.username = '用户名不能为空';
		}

		if (password == '') {
			err.password = '密码不能为空';
		}

		if (err.username != null || err.password != null) {
			return;
		}

		const res = await $loginMutation.mutateAsync();

		// 用户名和密码错误
		if (res.type == 'error' && res.errorCode == 'USERNAME_OR_PASSWORD_WRONG') {
			err.server.type = 'error';
			err.server.message = '用户名或密码错误';
			return;
		}

		// 登录成功
		if (res.type == 'OK') {
			const { username, type, token, cookies } = res.user;

			userStore.set({
				username,
				type,
				token,
				cookies
			});

			// 写入localStorage
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					username,
					type,
					token,
					cookies
				})
			);

			if (cookies.length > 0) {
				window.localStorage.setItem('usingCookies', cookies[0].content);
			}

			err.server = {
				type: 'success',
				message: '登录成功，即将跳转.'
			};

			// 5秒后，关闭loginForm
			let time = 0;
			const handler = () => {
				time += 1;
				err.server.message += '.';

				if (time > 5) {
					err.server = {
						type: null,
						message: null
					};
					dispatch('toggleLoginFormOpen');
					return;
				}

				setTimeout(handler, 1000);
			};
			handler();
		}
	};

	const loginMutation = createMutation({
		mutationFn: () => {
			return fetch(
				'/login',
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
		},
		onError: (err) => {}
	});

	$: btnText = $loginMutation.isPending ? '登录中...' : '登录';
</script>

<div class="w-full shrink-0 {toRightClass} transition-all duration-500">
	<FormTitle type="login" />
	<div class="w-full flex flex-col items-center">
		<div class="w-[20em] flex flex-col">
			<TextInput label="用户名" on:input={handleUsernameInput} error={err.username} />
			<SecretTextInput label="密码" error={err.password} on:input={handlePasswordInput} />
			<div class="mt-4"></div>
			<PrimaryButton {btnText} disable={$loginMutation.isPending} on:click={loginSubmit} />
		</div>
		<button class="mt-2" on:click={toRegisterForm}>
			<span class="text-blue-400 dark:text-blue-100 hover:underline underline-offset-4">
				没有帐号？点击注册
			</span>
		</button>
	</div>
	{#if err.server.type != null}
		<div class="mt-8"></div>
		<AlertMessage type={err.server.type} message={err.server.message} />
	{/if}
</div>
