<script>
	import Text from './Text.svelte';
	import Emphasis from './Emphasis.svelte';
	import Strong from './Strong.svelte';
	import Delete from './Delete.svelte';
	import InlineCode from './InlineCode.svelte';
	import Link from './Link.svelte';
	import Image from './Image.svelte';
	export let children = [];
</script>

<p class="my-1">
	{#each children as child}
		{#if child.type == 'text' && child.content != ''}
			<Text content={child.content} />
		{:else if child.type == 'emphasis'}
			<Emphasis children={child.children} />
		{:else if child.type == 'strong'}
			<Strong children={child.children} />
		{:else if child.type == 'delete'}
			<Delete children={child.children} />
		{:else if child.type == 'code'}
			<InlineCode content={child.content} />
		{:else if child.type == 'link'}
			<Link text={child.text} url={child.url} />
		{:else if child.type == 'image'}
			<Image alt={child.alt} url={child.url} title={child.title} on:largeImage />
		{/if}
	{/each}
</p>
