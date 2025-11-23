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

	export let stage = 'login';
	$: toRightClass =
		stage == 'login' ? 'translate-x-[-100%]' : stage == 'reset' ? '' : 'translate-x-[-200%]';

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
		password: null
	};

	let serverRes = {
		type: null,
		msg: null
	};

	const dispatch = createEventDispatcher();

	const toRegisterForm = () => {
		dispatch('toStage', { name: 'register' });
	};

	const toResetForm = () => {
		dispatch('toStage', { name: 'reset', extra: { username, resetCode: password } });
	};

	const loginSubmit = async () => {
		serverRes = {
			type: null,
			msg: null
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
		if (res.type == 'error') {
			if (res.errorCode == 'USERNAME_OR_PASSWORD_WRONG') {
				serverRes = {
					type: 'error',
					msg: '用户名或密码错误'
				};
			} else if (res.errorCode == 'USER_NOT_ENABLE') {
				serverRes = {
					type: 'error',
					msg: '用户已被禁止登录'
				};
			}
			return;
		}

		// 重设密码
		if (res.type == 'warning') {
			if (res.warningCode == 'NEED_NEW_PASS') {
				toResetForm();
				// 清空密码输入框
				password = '';
			} else {
				serverRes = {
					type: 'error',
					msg: '用户名或密码错误'
				};
			}
			return;
		}

		// 登录成功
		if (res.type == 'OK') {
			const { username, type, createTime, token, cookies } = res.user;

			let usingCookie = cookies.length > 1 ? cookies[0].content : null;

			userStore.set({
				username,
				createTime,
				type,
				token,
				cookies,
				usingCookie
			});

			// 写入localStorage
			window.localStorage.setItem(
				'user',
				JSON.stringify({
					username,
					createTime,
					type,
					token,
					cookies,
					usingCookie
				})
			);

			serverRes = {
				type: 'success',
				msg: '登录成功，即将跳转'
			};

			// 5秒后，关闭loginForm
			let time = 0;
			const handler = () => {
				time += 1;
				serverRes.msg += '.';

				if (time > 5) {
					serverRes = {
						type: null,
						msg: null
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
		mutationFn: async () =>
			await fetch(
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
			).then((r) => r.json())
	});

	$: btnText = $loginMutation.isPending ? '登录中...' : '登录';
</script>

<div class="w-full shrink-0 {toRightClass} transition-all duration-500">
	<FormTitle type="login" />
	<form
		class="w-full flex flex-col items-center"
		on:submit={(e) => {
			e.preventDefault();
		}}
	>
		<div class="w-[20em] flex flex-col">
			<TextInput
				label="用户名"
				value={username}
				on:input={handleUsernameInput}
				error={err.username}
			/>
			<SecretTextInput
				label="密码"
				value={password}
				error={err.password}
				on:input={handlePasswordInput}
			/>
			<div class="mt-4"></div>

			<PrimaryButton
				{btnText}
				disable={serverRes.type == 'success' || $loginMutation.isPending}
				on:click={loginSubmit}
			/>
		</div>
		<button class="mt-2" on:click={toRegisterForm}>
			<span class="text-blue-400 dark:text-blue-100 hover:underline underline-offset-4">
				没有帐号？点击注册
			</span>
		</button>
	</form>
	{#if serverRes.type != null}
		<div class="mt-8"></div>
		<AlertMessage type={serverRes.type} message={serverRes.msg} />
	{/if}
</div>
