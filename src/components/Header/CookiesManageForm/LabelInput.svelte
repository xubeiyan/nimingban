<script>
	import CloseCircleIcon from '$svgIcon/closeCircle.svelte';
	export let label = null;
	export let value = null;

	$: btnStyle = value == null || value == '' ? 'hidden' : '';
</script>

<label class="w-1/2 flex flex-col gap-1">
	<span>{label}</span>
	<div
		class="bg-slate-100/70 focus-within:bg-slate-100
		dark:bg-slate-700/50 dark:focus-within:bg-slate-700
		shadow-inner shadow-slate-300 dark:shadow-sky-900
		rounded-md px-2 py-1 flex items-center"
	>
		<input class="grow bg-transparent outline-none" name="labelInput" on:input {value} />
		<button class={btnStyle} on:click type="button">
			<CloseCircleIcon />
		</button>
	</div>
</label>
