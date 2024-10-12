<script>
	import CookiesIcon from '$svgIcon/cookies.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
	import PlusIcon from '$svgIcon/plus.svelte';
	import MaskIcon from '$svgIcon/mask.svelte';

	import { onMount } from 'svelte';

	import { userStore } from '../../store/userStore';
	import { createMutation } from '@tanstack/svelte-query';

	let usingCookies = null;

	const getNewCookiesMuation = createMutation({
		mutationFn: () => {}
	});

	onMount(() => {
		const usingCookiesFromLocalStorage = window.localStorage.getItem('usingCookies');
		if (usingCookiesFromLocalStorage == undefined) return;
		usingCookies = usingCookiesFromLocalStorage;
	});

	$: slotWidth = usingCookies == null ? 'w-[7em]' : 'w-full';

	const getNewCookies = () => {};
</script>

<button
	class="group relative rounded-md bg-sky-200 hover:bg-sky-300 dark:bg-sky-900 hover:dark:bg-sky-800 
    h-[2em] px-6 flex gap-1 items-center"
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
			<button
				class="w-full
                bg-sky-100/80 dark:bg-sky-800/70 hover:bg-sky-100 dark:hover:bg-sky-800
                rounded-sm h-[2em] flex justify-center items-center gap-1 px-1"
			>
				{#if c.content == usingCookies}
					<MaskIcon />
				{/if}
				{c.content}
			</button>
		{/each}
		{#if $userStore.cookies.length < 5}
			<button
				on:click={getNewCookies}
				class="w-full bg-orange-50 dark:bg-orange-700/50 hover:bg-orange-100 dark:hover:bg-orange-600/50
                rounded-sm h-[2em] flex justify-center items-center"
			>
				<PlusIcon />
			</button>
		{/if}
	</div>
</button>
