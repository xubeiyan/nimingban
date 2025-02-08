<script>
	export let readonly = false;
	export let value = '';

	$: borderStyle = readonly ? 'border-dotted' : '';
</script>

<div class="relative inline-flex items-center">
	<input
		name="value"
		type="text"
		{readonly}
		class="bg-transparent border-b-2
    border-slate-500 dark:border-cyan-100
    {borderStyle}
    outline-none text-slate-500 dark:text-cyan-100"
		on:input
		{value}
	/>
</div>
