<script>
	import Text from './Text.svelte';
	import Emphasis from './Emphasis.svelte';
	import Strong from './Strong.svelte';
	import Delete from './Delete.svelte';
	import InlineCode from './InlineCode.svelte';
	import Link from './Link.svelte';
	import Image from './Image.svelte';
	export let children = [];
	export let type = 'body';
	$: tag = type == 'header' ? 'th' : 'td';
</script>

<svelte:element this={tag} class="border border-slate-400 px-2 py-0.5">
	{#each children as c}
		{#if c.type == 'text' && c.content != ''}
			<Text content={c.content} />
		{:else if c.type == 'emphasis'}
			<Emphasis children={c.children} />
		{:else if c.type == 'strong'}
			<Strong children={c.children} />
		{:else if c.type == 'delete'}
			<Delete children={c.children} />
		{:else if c.type == 'code'}
			<InlineCode content={c.content} />
		{:else if c.type == 'link'}
			<Link text={c.text} url={c.url} />
		{:else if c.type == 'image'}
			<Image alt={c.alt} url={c.url} title={c.title} on:largeImage />
		{/if}
	{/each}
</svelte:element>
