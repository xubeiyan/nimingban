<script>
	import MaskIcon from '$svgIcon/mask.svelte';

	export let using = false;
	export let disable = false;
	export let content = null;

	$: btnStyle = disable ? 'cursor-not-allowed' : '';
	$: btnBgStyle = disable
		? 'bg-red-100/80 hover:bg-red-100 dark:bg-red-500/20 dark:hover:bg-red-500/40'
		: 'bg-sky-100/80 dark:bg-sky-800/70 hover:bg-sky-100 dark:hover:bg-sky-800';
</script>

<button
	class="w-full
    {btnBgStyle}
    rounded-sm h-[2em] flex justify-center items-center gap-1 px-1 {btnStyle}"
	on:click
>
	{#if using}
		<MaskIcon />
	{:else}
		<span class="inline-block w-[1.5em]"></span>
	{/if}
	{content}
</button>
