<script>
	export let type = 'loading';
	$: bgStyle = type == 'error' ? 'bg-red-200 dark:bg-red-900' : 'bg-indigo-200 dark:bg-sky-600';
</script>

<p class="{bgStyle} rounded-md px-4 py-2 mr-10">
	<slot />
</p>
