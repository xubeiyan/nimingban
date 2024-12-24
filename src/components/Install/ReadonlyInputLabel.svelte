<script>
	export let label = '';
	export let value = '';
</script>

<label class="flex flex-col gap-1 mb-2">
	<span>{label}</span>
	<input
		type="text"
		class="px-2 py-0.5 rounded-md w-[30em] outline-none
		bg-slate-200 dark:bg-slate-700"
		readonly
		{value}
	/>
</label>
