<script>
	export let active = false;
	export let type = 'primary';
	export let hintText = null;
	$: bgStyle =
		type == 'primary'
			? active
				? 'bg-sky-400 dark:bg-sky-400'
				: 'bg-sky-200 dark:bg-sky-600'
			: active
				? 'bg-cyan-200 dark:bg-cyan-600'
				: 'bg-cyan-300 dark:bg-cyan-700';
	$: hintBgStyle = 'bg-slate-200 dark:bg-slate-800';
</script>

<button type="button" class="group flex justify-center items-center {bgStyle} rounded-md px-2 relative" on:click>
	<slot />
	{#if hintText != null}
		<div
			class="invisible group-hover:visible text-nowrap
			px-2 py-1 absolute {hintBgStyle} top-[100%] mt-2 rounded-md"
		>
			<div
				class="absolute left-[50%] translate-x-[-50%] top-[-3px] size-2 {hintBgStyle} rotate-45"
			></div>
            <span>{hintText}</span>
		</div>
	{/if}
</button>
