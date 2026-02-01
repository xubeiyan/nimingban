<script>
	import Emphasis from './Emphasis.svelte';
	import Strong from './Strong.svelte';
	import Text from './Text.svelte';
	import Delete from './Delete.svelte';
	import InlineCode from './InlineCode.svelte';

	export let level = 1;
	export let children = [];

	$: style =
		level == 1
			? 'text-3xl font-extrabold break-words border-b-2 mb-4 pb-1 border-slate-800 dark:border-sky-500'
			: level == 2
				? 'text-2xl font-bold break-words border-b mb-2 pb-1 border-slate-800 dark:border-sky-500'
				: level == 3
					? 'text-xl mb-1 font-semibold break-words'
					: 'text-lg mb-1 break-words';
</script>

<h1 class={'text-autospace ' + style}>
	{#each children as child}
		{#if child.type == 'text'}
			<Text content={child.content} />
		{:else if child.type == 'emphasis'}
			<Emphasis children={child.children} />
		{:else if child.type == 'strong'}
			<Strong children={child.children} />
		{:else if child.type == 'delete'}
			<Delete children={child.children} />
		{:else if child.type == 'code'}
			<InlineCode content={child.content} />
		{/if}
	{/each}
</h1>
