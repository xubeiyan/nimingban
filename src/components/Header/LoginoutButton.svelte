<script>
	export let hintText = null;

	let bgStyle = 'bg-slate-300 dark:bg-slate-800';
	let shadowStyle = 'shadow-slate-400 dark:shadow-slate-700';
</script>

<button
	class="group bg-sky-600 hover:bg-sky-500/70
    dark:bg-sky-200 hover:dark:bg-sky-100
    size-[2em] rounded-md flex justify-center items-center relative"
	on:click
>
	<slot />
	{#if hintText != null}
		<div
			class="invisible group-hover:visible shadow-md {shadowStyle} w-[5em] p-1 absolute {bgStyle} top-[100%] mt-2 rounded-md"
		>
			<div
				class="absolute left-[50%] translate-x-[-50%] top-[-3px] size-2 {bgStyle} rotate-45"
			></div>
			<span>{hintText}</span>
		</div>
	{/if}
</button>
