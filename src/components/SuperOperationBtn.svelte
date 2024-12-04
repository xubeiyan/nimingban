<script>
	export let type = '';

	$: bgStyle =
		type == 'delete'
			? 'bg-red-100/80 dark:bg-red-700/50 hover:bg-red-100 hover:dark:bg-red-700/70'
			: 'bg-fuchsia-100/80 dark:bg-violet-700/80 hover:bg-fuchsia-100 hover:dark:bg-violet-700';
</script>

<button class="{bgStyle} shadow-md rounded-md py-1 px-3 break-keep" on:click>
	<slot />
</button>
