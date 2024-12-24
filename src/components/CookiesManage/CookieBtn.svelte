<script>
	import { cookieManageStore } from '../../store/cookieManageStore';
	import { userStore } from '../../store/userStore';

	export let content = null;
</script>

<span class="dark:text-indigo-100"
	>饼干：{#if $userStore.type == 'admin'}
		<button
			class="bg-sky-200/60 hover:bg-sky-200
            dark:bg-indigo-800/70 dark:hover:bg-indigo-800 rounded-md px-1"
			on:click={() => {
				cookieManageStore.update((c) => ({
					username: null,
					cookie: content
				}));
			}}>{content}</button
		>
	{:else}
		{content}
	{/if}
</span>
