<script>
	import KeyIcon from '../assets/svg-icons/key.svelte';
	import LockIcon from '../assets/svg-icons/lock.svelte';
	import ForwardIcon from '../assets/svg-icons/forward.svelte';

	import { createEventDispatcher } from 'svelte';
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

	let loginForm = {
		username: '',
		password: ''
	};

	let registerForm = {
		username: '',
		password: '',
		confirm: '',
		errors: []
	};

	const clearRegisterError = () => {
		registerForm.errors = [];
		registerForm = registerForm;
	};

	const postRegisterForm = async () => {
		if (registerForm.username == '') {
			registerForm.errors.push('用户名不能为空');
		}

		if (registerForm.password == '') {
			registerForm.errors.push('密码不能为空');
		}

		if (registerForm.confirm == '') {
			registerForm.errors.push('确认密码不能为空');
		}

		if (registerForm.confirm != registerForm.password) {
			registerForm.errors.push('密码和确认密码不一致');
		}

		if (registerForm.errors.length > 0) {
			registerForm = registerForm;
			return;
		}

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
		console.log(resJson);
	};
</script>

<div
	class="absolute right-0 w-full {open_class} h-full bg-slate-800/20 dark:bg-slate-800/90
  transition-transform duration-500 ease-in-out"
>
	<div class="container h-full m-auto flex justify-end overflow-hidden">
		<div
			class="relative w-full bg-sky-50 dark:bg-sky-900/80 h-max mt-2 md:mt-8 rounded-md shadow-sm px-8 py-16"
		>
			<button
				class="absolute border border-zinc-200 dark:border-zinc-700
				bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700
      rounded-md size-[2em] flex justify-center items-center top-4 right-4"
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
					<div class="w-72 m-auto pt-10 dark:text-zinc-100">
						<label class="flex flex-col mb-4">
							<span class="mb-1 pl-1">登录名称</span>
							<input
								type="text"
								class="rounded-md border border-zinc-300 dark:border-zinc-600
              focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400
              bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700
              text-zinc-900 dark:text-zinc-50
              p-1 outline-none"
							/>
						</label>
						<label class="flex flex-col mb-4">
							<span class="mb-1 pl-1">密码</span>
							<input
								type="password"
								class="rounded-md border border-zinc-300 dark:border-zinc-600
						focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400
						bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700
						text-zinc-900 dark:text-zinc-50
						p-1 outline-none"
							/>
						</label>
						<button
							class="w-full h-12 dark:text-zinc-100 bg-sky-600 hover:bg-sky-500 dark:bg-zinc-800 hover:dark:bg-zinc-700 text-zinc-100 rounded-md"
						>
							登录
						</button>
						<button
							class="mt-2 border-hidden hover:border-b hover:border-solid hover:border-black"
							on:click={() => scrollTo('register')}>没有账号？去注册</button
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
								class="rounded-md border border-zinc-300 dark:border-zinc-600
              focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400
              bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700
              text-zinc-900 dark:text-zinc-50
              p-1 outline-none"
								bind:value={registerForm.username}
								on:input={clearRegisterError}
							/>
						</label>
						<label class="flex flex-col mb-4">
							<span class="mb-1 pl-1">密码</span>
							<input
								type="password"
								class="rounded-md border border-zinc-300 dark:border-zinc-600
						focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400
						bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700
						text-zinc-900 dark:text-zinc-50
						p-1 outline-none"
								bind:value={registerForm.password}
								on:input={clearRegisterError}
							/>
						</label>
						{#if registerForm.password != ''}
							<label class="flex flex-col mb-4">
								<span class="mb-1 pl-1">确认密码</span>
								<input
									type="password"
									class="rounded-md border border-zinc-300 dark:border-zinc-600
						focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400
						bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700
						text-zinc-900 dark:text-zinc-50
						p-1 outline-none"
									bind:value={registerForm.confirm}
									on:input={clearRegisterError}
								/>
							</label>
						{/if}
						{#if registerForm.errors.length > 0}
							<div class="space-y-1 my-2">
								{#each registerForm.errors as error}
									<p class="border border-red-400 bg-red-100 px-2 py-1 rounded-md">{error}</p>
								{/each}
							</div>
						{/if}
						<button
							class="w-full h-12 dark:text-zinc-100 bg-sky-600 hover:bg-sky-500 dark:bg-zinc-800 hover:dark:bg-zinc-700 text-zinc-100 rounded-md"
							on:click={postRegisterForm}
						>
							注册
						</button>
						<button
							class="mt-2 border-hidden hover:border-b hover:border-solid hover:border-black"
							on:click={() => scrollTo('login')}>已有账号，登录</button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
