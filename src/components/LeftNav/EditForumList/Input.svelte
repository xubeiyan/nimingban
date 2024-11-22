<script>
	export let value = null;
</script>

<input
	type="text"
	bind:value
	class="grow bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded-md
    shadow-inner shadow-slate-300 dark:shadow-slate-700
    focus-within:outline-none focus-within:bg-white dark:focus-within:bg-black"
	on:input
/>
