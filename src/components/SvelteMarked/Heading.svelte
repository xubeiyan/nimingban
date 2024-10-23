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
			? 'text-3xl font-extrabold border-b-2 mb-4 pb-1 border-slate-800 dark:border-cyan-400'
			: level == 2
				? 'text-2xl font-bold border-b mb-2 pb-1 border-slate-800 dark:border-cyan-400'
				: level == 3
					? 'text-xl font-semibold'
					: 'text-lg';
</script>

<h1 class={style}>
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
