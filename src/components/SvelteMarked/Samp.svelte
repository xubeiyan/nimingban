<script>
	export let children = [];

	const spanStyle = (type) => {
		if (type == 'prompt') {
			return 'text-green-600 dark:text-green-400';
		} else if (type == 'userInput') {
			return 'font-bold';
		} else {
			return 'text-slate-700/90 dark:text-gray-200/90';
		}
	};
</script>

<pre
	class="rounded-md bg-zinc-100 dark:bg-zinc-600
    px-3 py-2 my-2 text-sm/4 block
    shadow-inner dark:shadow-slate-700">
<samp class="block"
		>{#each children as c}<span class="{spanStyle(c.type)} text-wrap break-all max-w-full">{c.content}</span>{/each}</samp
	></pre>
