<script>
	import LoginIcon from '$svgIcon/login.svelte';
	import WidgetIcon from '$svgIcon/widget.svelte';
	import LogoutIcon from '$svgIcon/logout.svelte';
	import UserAvatarIcon from '$svgIcon/userAvatar.svelte';

	import DarkModeSwitch from './darkModeSwitch.svelte';
	import { userStore } from '../store/userStore';
	import { loginAlreadyExpire } from '../lib/user/utils';

	import { createEventDispatcher, onMount } from 'svelte';
	import LoginoutButton from './Header/LoginoutButton.svelte';
	import CookiesStatusButton from './Header/CookiesStatusButton.svelte';
	import UserProfile from './UserProfile.svelte';
	import UserManageBtn from './Header/UserManageBtn.svelte';
	import CookiesManageBtn from './Header/CookiesManageBtn.svelte';
	import CookiesManageForm from './Header/CookiesManageForm.svelte';
	import SiteSettingBtn from './Header/SiteSettingBtn.svelte';
	import SiteSettingForm from './Header/SiteSettingForm.svelte';
	import UserManageForm from './Header/UserManageForm.svelte';

	export let leftNavOpen;
	export let siteName = '未知名称';

	let userProfile = null;

	const dispatch = createEventDispatcher();

	// 打开或关闭左边的导航
	const toggleLeftNavbarOpen = () => {
		siteSetting.hideForm();
		cookieManage.hideForm();
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
			token: null,
			cookies: [],
			usingCookie: null
		});

		window.localStorage.removeItem('user');
	};

	// 打开UserProfile
	const openUserProfile = () => {
		if (userProfile == null) return;
		userProfile.openDialog();
	};

	let cookieManage = null;
	let userManage = null;
	let siteSetting = null;

	// 打开指定的表单（参数设置，用户管理，饼干管理）
	const toggleForm = (name) => {
		if (userManage == null || cookieManage == null || siteSetting == null) return;
		// 先获取这几个Form的状态，因为closeHeaderForms会改变所有的状态
		const userManageHide = userManage.isHide();
		const cookieManageHide = cookieManage.isHide();
		const siteSettingHide = siteSetting.isHide();
		closeHeaderForms();

		if (name == 'userManage' && userManageHide) {
			userManage.showForm();
		} else if (name == 'cookieManage' && cookieManageHide) {
			cookieManage.showForm();
		} else if (name == 'siteSetting' && siteSettingHide) {
			siteSetting.showForm();
		}

		dispatch('message', {
			type: 'openHeaderForm'
		});
	};

	export const closeHeaderForms = () => {
		userManage.hideForm();
		cookieManage.hideForm();
		siteSetting.hideForm();
	};

	// 接受搜索用户
	const handleSearchUser = ({ username }) => {
		closeHeaderForms();
		userManage.showForm({ username });
	};

	onMount(() => {
		const userInLocalStorage = window.localStorage.getItem('user');
		// localStorage 没有则什么都不做
		if (userInLocalStorage == undefined) return;

		const user = JSON.parse(userInLocalStorage);
		if (user == undefined) return;

		if (loginAlreadyExpire(user)) {
			logout();
		}
		// // 检查 localStorage 有无 usingCookies，无则添加
		// const usingCookies = window.localStorage.getItem('usingCookies');
		// if (user.cookies.length > 0 && usingCookies == undefined) {
		// 	window.localStorage.setItem('usingCookies', user.cookies[0].content);
		// }

		userStore.set(user);
	});
</script>

<nav class="bg-sky-100 dark:bg-sky-950 dark:text-white p-2 flex justify-center z-20 shadow-md">
	<div class="container flex justify-between items-center">
		<div class="flex gap-2 items-center">
			<button
				class="border border-cyan-400 dark:border-cyan-200 bg-cyan-500/70 hover:bg-cyan-400 dark:bg-cyan-100 hover:dark:bg-cyan-200 size-[2em]
      flex justify-center items-center rounded-md"
				on:click={toggleLeftNavbarOpen}
			>
				<WidgetIcon open={leftNavOpen} />
			</button>
			<a href="/" class="hover:underline underline-offset-4">{siteName}</a>
			{#if $userStore.type == 'admin'}
				<SiteSettingBtn on:click={() => toggleForm('siteSetting')} />
			{/if}
		</div>
		<div class="flex gap-2 items-center">
			{#if $userStore.type == 'admin'}
				<UserManageBtn on:click={() => toggleForm('userManage')} />
				<CookiesManageBtn on:click={() => toggleForm('cookieManage')} />
			{/if}
			{#if $userStore.username != null}
				{#if $userStore.type == 'user'}
					<CookiesStatusButton />
				{/if}
				<button
					class="flex gap-1 items-center
					border border-sky-700 dark:border-sky-100
					bg-transparent
					hover:bg-sky-200 hover:dark:bg-sky-800
					 rounded-md px-2 h-[2em]"
					on:click={openUserProfile}
				>
					<UserAvatarIcon />
					<span>{$userStore.username}</span>
				</button>
				<LoginoutButton on:click={logout} hintText="退出登录">
					<LogoutIcon />
				</LoginoutButton>
			{:else}
				<LoginoutButton on:click={toggleLoginFormOpen} hintText="登录/注册">
					<LoginIcon />
				</LoginoutButton>
			{/if}
			<DarkModeSwitch />
		</div>
	</div>
</nav>
<UserProfile bind:this={userProfile} />
<CookiesManageForm bind:this={cookieManage} on:searchUser={(e) => handleSearchUser(e.detail)} />
<UserManageForm bind:this={userManage} />
<SiteSettingForm bind:this={siteSetting} />
