<script>
	export let label = '未知label';
	export let placeholder = '';
	let inputStyle = `outline-none 
        border border-slate-300 
        focus-within:border-slate-600 focus-within:dark:border-slate-400 
        dark:border-slate-600 focus-within:dark:bg-slate-600 
        dark:bg-slate-700 rounded-md`;
</script>

<label class="grow flex flex-col gap-1">
	<span>{label}</span>
	<input class="{inputStyle} px-2 py-0.5" {placeholder} on:input />
</label>
