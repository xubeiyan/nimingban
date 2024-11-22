<script>
	export let value = null;
	$: rows = value.split('\n').length < 2 ? 2 : value.split('\n').length + 1;
</script>

<textarea
	{rows}
	class="grow bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded-md
    shadow-inner shadow-slate-300 dark:shadow-slate-700
    focus-within:outline-none focus-within:bg-white dark:focus-within:bg-black"
	on:input>{value}</textarea
>
