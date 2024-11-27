<script>
	export let loading = false;

	import CheckIcon from '$svgIcon/check.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
</script>

<button
	class="rounded-md bg-violet-300/80 hover:bg-violet-300
dark:bg-violet-400/70 dark:hover:bg-violet-400 px-2 py-1"
	on:click
>
	{#if loading}
		<LoadingIcon size="1.25em" />
	{:else}
		<CheckIcon />
	{/if}
</button>
