<script>
	export let children = [];

	// 代码过长显示展开
	let blockOpen = false;
	$: codeblockStyle = blockOpen ? '' : 'overflow-y-hidden max-h-[15rem]';

	if (children.length > 1 && children[0].content.length <= 6) {
		blockOpen = true;
	}

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
	class="{codeblockStyle} relative rounded-md bg-zinc-100 dark:bg-zinc-600
    px-3 py-0 text-sm/4 block
    shadow-inner dark:shadow-slate-700">
	<samp class="block"
		>{#each children as c}<span class="{spanStyle(c.type)} text-wrap break-all max-w-full"
				>{c.content}</span
			>{/each}</samp
	>
	{#if !blockOpen}
		<button
			class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md
			shadow-sm shadow-slate-300 dark:shadow-slate-600
			bg-sky-200/80 hover:bg-sky-200 dark:bg-cyan-500/80 dark:hover:bg-cyan-500"
			on:click={() => {
				blockOpen = true;
			}}>展开代码</button
		>
	{/if}
</pre>
