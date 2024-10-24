<script>
	import AlertTriangle from '$svgIcon/alertTriangle.svelte';

	export let type = 'error';

	export let message = null;

	$: warningMessage = message == null ? '' : ` - ${message}`;
</script>

<div class="container mt-10 bg-amber-100 dark:bg-amber-400 rounded-md p-8">
	<h1 class="text-amber-500 dark:text-amber-700 text-xl flex gap-2 items-center">
		<AlertTriangle />
		<span>警告 {warningMessage}</span>
	</h1>
</div>
