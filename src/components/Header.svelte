<script>
	import LoginIcon from '$svgIcon/login.svelte';
	import WidgetIcon from '$svgIcon/widget.svelte';
	import LogoutIcon from '$svgIcon/logout.svelte';
	import UserAvatarIcon from '$svgIcon/userAvatar.svelte';

	import DarkModeSwitch from './darkModeSwitch.svelte';
	import { userStore } from '../store/userStore';

	import { createEventDispatcher, onMount } from 'svelte';
	import LoginoutButton from './Header/LoginoutButton.svelte';

	export let leftNavOpen;

	const dispatch = createEventDispatcher();

	// 打开或关闭左边的导航
	const toggleLeftNavbarOpen = () => {
		dispatch('message', {
			type: 'toggleLeftNavbarOpen'
		});
	};

	// 打开或关闭右边的登录框
	const toggleLoginFormOpen = () => {
		dispatch('message', {
			type: 'toggleLoginFormOpen'
		});
	};

	// 退出登录
	const logout = () => {
		userStore.set({
			username: null,
			type: null,
			token: null
		});

		window.localStorage.removeItem('user');
	};

	onMount(() => {
		const userInLocalStorage = window.localStorage.getItem('user');
		if (userInLocalStorage != undefined) {
			const user = JSON.parse(userInLocalStorage);
			if (user == undefined) return;

			userStore.set(user);
		}
	});
</script>

<nav class="bg-sky-100 dark:bg-sky-950 dark:text-white p-2 flex justify-center z-10 shadow-md">
	<div class="container flex justify-between items-center">
		<div class="flex gap-2 items-center">
			<button
				class="border border-cyan-400 dark:border-cyan-200 bg-cyan-500/70 hover:bg-cyan-400 dark:bg-cyan-100 hover:dark:bg-cyan-200 size-[2em]
      flex justify-center items-center rounded-md"
				on:click={toggleLeftNavbarOpen}
			>
				<WidgetIcon open={leftNavOpen} />
			</button>
			<span>匿名版</span>
		</div>
		<div class="flex gap-2 items-center">
			{#if $userStore.username != null}
				<button
					class="flex gap-2 items-center
					border border-sky-700 dark:border-sky-100
					bg-sky-100 dark:bg-sky-800
					hover:bg-sky-200 hover:dark:bg-sky-700
					 rounded-md px-2 py-1"
				>
					<UserAvatarIcon />
					<span>{$userStore.username}</span>
				</button>
				<LoginoutButton on:click={logout}>
					<LogoutIcon />
				</LoginoutButton>
			{:else}
				<LoginoutButton on:click={toggleLoginFormOpen}>
					<LoginIcon />
				</LoginoutButton>
			{/if}
			<DarkModeSwitch />
		</div>
	</div>
</nav>
