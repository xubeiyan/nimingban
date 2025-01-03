<script>
	export let label = '';
	export let type = 'text';
</script>

<label class="flex flex-col gap-1">
	<span>{label}</span>
	<input
		class="w-full rounded-md px-2 py-0.5 outline-none border
		border-slate-200 dark:border-slate-600
        bg-slate-50 focus-within:bg-white
        dark:bg-slate-700 dark:focus-within:bg-slate-900"
		{type}
		on:input
	/>
</label>
