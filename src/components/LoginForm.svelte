<script>
	import KeyIcon from '../assets/svg-icons/key.svelte';
	import LockIcon from '../assets/svg-icons/lock.svelte';
	import ForwardIcon from '../assets/svg-icons/forward.svelte';

	import { createEventDispatcher } from 'svelte';
	import SecretTextInput from './LoginForm/SecretTextInput.svelte';

	const dispatch = createEventDispatcher();

	const closeLoginForm = () => {
		dispatch('message', {
			type: 'closeLoginForm'
		});
	};

	export let open;
	$: open_class = open ? 'translate-x-0' : 'translate-x-[100%]';

	let translateX = 'translate-x-0';
	const scrollTo = (target) => {
		if (target == 'register') {
			translateX = 'translate-x-[-100%]';
		} else if (target == 'login') {
			translateX = 'translate-x-0';
		}
	};

	let textInputBorderStyle =
		'border border-zinc-300 dark:border-zinc-600 focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400';
	let textInputBgStyle =
		'bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700';
	// 输入框样式
	$: textInputStyle = `w-full rounded-md p-1 outline-none ${textInputBgStyle} ${textInputBorderStyle}`;

	// 下划线样式
	let underlinStyle =
		'border-hidden hover:border-b hover:border-solid hover:border-black hover:dark:border-slate-100';

	// 主要按钮样式
	let mainBtnStyle =
		'bg-sky-200/60 hover:bg-sky-200 dark:bg-slate-100/20 hover:dark:bg-slate-100/40';

	let loginForm = {
		username: '',
		password: '',
		submiting: false,
		errors: {
			username: null,
			password: null
		}
	};

	let registerForm = {
		username: '',
		password: '',
		confirm: '',
		submiting: false,
		errors: {
			username: null,
			password: null,
			confirm: null
		},
		// 是否显示确认密码部分
		confirmInputShow: true
	};

	const updateInput = (type, value) => {
		if (type == 'password') {
			registerForm.password = value;
			clearRegisterError();
		} else if (type == 'confirm') {
			registerForm.confirm = value;
			clearRegisterError();
		} else if (type == 'login_password') {
			loginForm.password = value;
		}
	};

	const clearRegisterError = () => {
		registerForm.errors = {
			username: null,
			password: null,
			confirm: null
		};
	};

	// 登录
	const postloginForm = async () => {
		if (loginForm.username == '') {
			loginForm.errors.username = '用户名不能为空';
		}

		if (loginForm.password == '') {
			loginForm.errors.password = '密码不能为空';
		}

		for (let one of Object.values(loginForm.errors)) {
			if (one !== null) return;
		}

		const res = await fetch('/login', {
			method: 'POST',
			body: JSON.stringify({
				username: loginForm.username,
				password: loginForm.password
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
	};

	// 注册
	const postRegisterForm = async () => {
		if (registerForm.username == '') {
			registerForm.errors.username = '用户名不能为空';
		}

		if (registerForm.password == '') {
			registerForm.errors.password = '密码不能为空';
		}

		if (registerForm.confirm == '') {
			registerForm.errors.confirm = '确认密码不能为空';
		}

		if (registerForm.confirm != registerForm.password) {
			registerForm.errors.password = '密码和确认密码不一致';
			registerForm.errors.confirm = '密码和确认密码不一致';
		}

		for (let one of Object.values(registerForm.errors)) {
			if (one !== null) return;
		}

		registerForm.submiting = true;
		const res = await fetch('/register', {
			method: 'POST',
			body: JSON.stringify({
				username: registerForm.username,
				password: registerForm.password
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const resJson = await res.json();
		registerForm.submiting = false;
		if (resJson.type !== 'success') {
			// 用户已存在
			if (resJson.errorCode == 'USER_NAME_EXISTS') {
				registerForm.errors.username = `用户名${registerForm.username}已经存在`;
				return;
			}
		}
	};
</script>

<div
	class="fixed right-0 w-full {open_class} h-full bg-slate-800/20 dark:bg-slate-800/90
  transition-transform duration-500 ease-in-out"
>
	<div class="container h-full m-auto flex justify-end overflow-hidden">
		<div
			class="relative w-full bg-sky-50 dark:bg-sky-900/80 h-max mt-2 md:mt-8 rounded-md shadow-sm px-8 py-16"
		>
			<button
				class="absolute top-4 right-4 rounded-md size-[2em]
				bg-zinc-200/70 hover:bg-zinc-200 dark:bg-sky-800 dark:hover:bg-sky-700/70
       			flex justify-center items-center"
				on:click={closeLoginForm}
			>
				<ForwardIcon />
			</button>
			<div class="flex flex-nowrap transition-transform duration-500 {translateX}">
				<form class="w-full shrink-0">
					<h2 class="text-4xl flex gap-4 justify-center items-center dark:text-zinc-100">
						<LockIcon />
						登录
					</h2>
					<div class="w-72 m-auto pt-10">
						<label class="flex flex-col mb-4">
							<span class="mb-1 pl-1">登录名称</span>
							<input type="text" bind:value={loginForm.username} class={textInputStyle} />
							{#if loginForm.errors.username}
								<span class="pl-1 pt-1 text-sm text-red-800 dark:text-red-300"
									>{loginForm.errors.username}</span
								>
							{/if}
						</label>
						<SecretTextInput
							label="密码"
							error={loginForm.errors.password}
							on:updateInput={(e) => updateInput('login_password', e.detail)}
						/>
						<button class="w-full h-12 rounded-md {mainBtnStyle}" on:click={postloginForm}>
							登录
						</button>
						<button class="mt-2 {underlinStyle}" on:click={() => scrollTo('register')}
							>没有账号？去注册</button
						>
					</div>
				</form>
				<form class="w-full shrink-0">
					<h2 class="text-4xl flex gap-4 justify-center items-center dark:text-zinc-100">
						<KeyIcon />
						注册
					</h2>
					<div class="w-72 m-auto pt-10 dark:text-zinc-100">
						<label class="flex flex-col mb-4">
							<span class="mb-1 pl-1">用户名</span>
							<input
								type="text"
								class={textInputStyle}
								bind:value={registerForm.username}
								on:input={clearRegisterError}
							/>
							{#if registerForm.errors.username}
								<span class="pl-1 pt-1 text-sm text-red-800 dark:text-red-300"
									>{registerForm.errors.username}</span
								>
							{/if}
						</label>
						<SecretTextInput
							label="密码"
							error={registerForm.errors.password}
							on:updateInput={(e) => updateInput('password', e.detail)}
						/>
						{#if registerForm.confirmInputShow}
							<SecretTextInput
								label="确认密码"
								error={registerForm.errors.confirm}
								on:updateInput={(e) => updateInput('confirm', e.detail)}
							/>
						{/if}
						<button
							class="w-full h-12 rounded-md {mainBtnStyle}"
							disabled={registerForm.submiting}
							on:click={postRegisterForm}
						>
							{registerForm.submiting ? '请求中...' : '注册'}
						</button>
						<button class="mt-2 {underlinStyle}" on:click={() => scrollTo('login')}
							>已有账号，登录</button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
