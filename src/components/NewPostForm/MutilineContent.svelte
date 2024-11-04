<script>
	export let label = '正文';
	export let replyContent = null;
	export let value = '';
	let inputStyle = `outline-none 
        border border-slate-300 
        focus-within:border-slate-600 focus-within:dark:border-slate-400 
        dark:border-slate-600 focus-within:dark:bg-slate-600 
        dark:bg-slate-700 rounded-md`;
</script>

<label class="grow flex flex-col gap-1 mt-3">
	<span>{label}</span>
	{#if replyContent != null}
		<p class="border border-slate-400 rounded-md px-2 py-1">{replyContent}</p>
	{/if}
	<textarea class="{inputStyle} px-2 py-1 grow" rows="10" bind:value on:input></textarea>
</label>
