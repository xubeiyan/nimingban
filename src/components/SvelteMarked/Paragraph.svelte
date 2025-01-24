<script>
	import Text from './Text.svelte';
	import Emphasis from './Emphasis.svelte';
	import Strong from './Strong.svelte';
	import Delete from './Delete.svelte';
	import InlineCode from './InlineCode.svelte';
	import Link from './Link.svelte';
	import Image from './Image.svelte';
	import Spoiler from './Spoiler.svelte';
	export let children = [];
</script>

<p class="my-1 empty:h-[0.75rem]">
	{#each children as child}
		{#if child.type == 'text'}
			{#if child.content != ''}
				<Text content={child.content} />
			{/if}
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
		{:else if child.type == 'spolier'}
			<Spoiler children={child.children} />
		{/if}
	{/each}
</p>
