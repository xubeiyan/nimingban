<script>
	import CookiesIcon from '$svgIcon/cookies.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
	import PlusIcon from '$svgIcon/plus.svelte';

	import { onMount } from 'svelte';

	import { userStore } from '../../store/userStore';
	import { createMutation } from '@tanstack/svelte-query';
	import SingleCookie from './CookiesStatusButton/SingleCookie.svelte';

	let usingCookies = null;

	// 获取饼干状态
	let lastGetCookies = {
		status: 'idle',
		message: null
	};

	const getNewCookiesMuation = createMutation({
		mutationFn: async () => {
			let headers = {};

			// 有userStore.token字段则附上
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}
			const res = await fetch('/user/getNewCookies', {
				method: 'GET',
				headers
			}).then((r) => r.json());

			return res;
		}
	});

	onMount(() => {
		if ($userStore.usingCookie == undefined) return;
		usingCookies = $userStore.usingCookie;
	});

	$: slotWidth = usingCookies == null ? 'w-[10em]' : 'w-full';
	$: statusBtnWidth = usingCookies == null ? '' : 'w-[8em]';

	const getNewCookies = async () => {
		const res = await $getNewCookiesMuation.mutateAsync();
		if (res.type != 'ok') {
			lastGetCookies.status = 'failed';
			if (res.errorCode == 'NO_SUCH_USER') {
				lastGetCookies.message = '对应用户不存在';
			} else if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				lastGetCookies.message = '当前用户不允许此操作';
			} else if (res.errorCode == 'REACH_COOKIES_LIMIT') {
				lastGetCookies.message = '已到达饼干上限';
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				lastGetCookies.message = `认证字段不正确`;
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				lastGetCookies.message = `需要退出后重新登录`;
			} else if (res.errorCode == 'COOKIES_GETTIME_LIMIT') {
				const errorMessages = {
					'1st need 1 day': '第 1 个饼干需要注册 1 天后才能领取',
					'2nd need 30 days': '第 2 个饼干需要注册 30 天后才能领取',
					'3rd need 90 days': '第 3 个饼干需要注册 90 天后才能领取',
					'4th need 180 days': '第 4 个饼干需要注册 180 天后才能领取',
					'5th need 365 days': '第 5 个饼干需要注册 365 天后才能领取'
				};
				lastGetCookies.message = errorMessages[res.extra];
			}

			return;
		}

		lastGetCookies = {
			status: 'ok',
			message: null
		};
		const cookies = res.cookies;

		userStore.update((store) => {
			return { ...store, cookies };
		});

		// 写入localStorage
		window.localStorage.setItem('user', JSON.stringify($userStore));
	};

	// 使用某个cookies
	const useCookies = (cookies) => {
		userStore.update((u) => ({
			...u,
			usingCookie: cookies
		}));
		usingCookies = cookies;
		// 写入localStorage
		window.localStorage.setItem('user', JSON.stringify($userStore));
	};
</script>

<button
	class="group relative rounded-md bg-sky-200 hover:bg-sky-300 dark:bg-sky-900 hover:dark:bg-sky-800
    h-[2em] {statusBtnWidth} px-2 flex justify-center gap-1 items-center"
>
	<CookiesIcon />
	{#if usingCookies != null}
		<span>{usingCookies}</span>
	{/if}
	<div
		class="invisible group-hover:visible
        absolute left-[50%] translate-x-[-50%] top-[100%]
        {slotWidth} bg-sky-200 dark:bg-sky-900 p-2 rounded-md space-y-2
        shadow-sm dark:shadow-slate-500"
	>
		{#each $userStore.cookies as c}
			<SingleCookie
				using={usingCookies == c.content}
				content={c.content}
				disable={c.status != 'enable'}
				on:click={() => useCookies(c.content)}
			/>
		{/each}
		{#if $userStore.cookies.length < 5}
			<div class="relative">
				<button
					on:click={getNewCookies}
					class="w-full group bg-orange-50 dark:bg-orange-700/50 hover:bg-orange-100 dark:hover:bg-orange-600/50
			rounded-sm h-[2em] flex justify-center items-center"
					disabled={$getNewCookiesMuation.isPending}
				>
					{#if $getNewCookiesMuation.isPending}
						<LoadingIcon />
					{:else}
						<PlusIcon />
					{/if}
				</button>
				{#if lastGetCookies.status == 'failed'}
					<div
						class="group-hover:visible invisible absolute top-[100%] left-[50%] translate-x-[-50%] w-auto"
					>
						<div
							class="size-[1em] bg-gray-200 dark:bg-gray-800 rotate-45 absolute top-[.5em] left-[50%] translate-x-[-50%]"
						></div>
						<div
							class="rounded-md shadow-sm shadow-gray-700 bg-gray-200 dark:bg-gray-800 p-2 text-nowrap mt-[1em]"
						>
							{lastGetCookies.message}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</button>
