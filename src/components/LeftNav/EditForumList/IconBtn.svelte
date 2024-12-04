<script>
	export let hintText = null;
</script>

<div class="relative inline-flex group">
	<button
		class="group flex justify-center items-center bg-indigo-200 dark:bg-indigo-400 size-[2em] rounded-md"
		on:click
	>
		<slot />
	</button>
	{#if hintText != null}
		<div
			class="hidden break-keep group-hover:block absolute left-[50%] top-[140%] translate-x-[-50%] z-30"
		>
			<span
				class="absolute left-[50%] top-[-70%] translate-x-[-50%] size-0
                border-8 border-transparent border-b-slate-300/70 dark:border-b-slate-700"
			></span>
			<span
				class="bg-slate-300/70 dark:bg-slate-700 px-2 py-1 rounded-md
            shadow-sm shadow-slate-400 dark:shadow-slate-900">{hintText}</span
			>
		</div>
	{/if}
</div>
