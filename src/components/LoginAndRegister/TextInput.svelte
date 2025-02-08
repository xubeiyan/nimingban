<script>
	export let label = '';
	export let error = null;

	let textInputBorderStyle =
		'border border-slate-400 dark:border-zinc-600 focus-visible:border-slate-700 dark:focus-visible:border-zinc-400';
	let textInputBgStyle =
		'bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700';
	// 输入框样式
	$: textInputStyle = `w-full rounded-md px-2 py-1 outline-none ${textInputBgStyle} ${textInputBorderStyle}`;
</script>

<label class="flex flex-col mb-4">
	<span class="mb-1 pl-1">{label}</span>
	<input class={textInputStyle} on:input name="input" />
	{#if error != null}
		<span class="pl-1 pt-1 text-sm text-red-800 dark:text-red-300">{error}</span>
	{/if}
</label>
