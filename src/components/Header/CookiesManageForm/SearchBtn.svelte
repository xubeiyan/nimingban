<script>
	import SearchIcon from '$svgIcon/search.svelte';
	export let disabled = true;
	$: bgStyle = disabled
		? 'cursor-not-allowed'
		: 'bg-sky-200/80 hover:bg-sky-200 dark:bg-sky-600/70 hover:dark:bg-sky-600';
</script>

<button
	type="button"
	{disabled}
	on:click
	class="shrink-0 rounded-md size-[2em] {bgStyle}
        flex justify-center items-center self-end"
>
	<SearchIcon />
</button>
