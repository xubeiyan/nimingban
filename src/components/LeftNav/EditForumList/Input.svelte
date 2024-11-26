<script>
	export let value = null;
	export let suffix = null;
</script>

<div
	class="grow flex bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded-md
    shadow-inner shadow-slate-300 dark:shadow-slate-700
     focus-within:bg-white dark:focus-within:bg-black"
>
	<input type="text" bind:value on:input class="grow bg-transparent focus-within:outline-none" />
	{#if suffix != null}
		<span>{suffix}</span>
	{/if}
</div>
