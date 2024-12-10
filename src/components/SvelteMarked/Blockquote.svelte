<script>
	import Link from './Link.svelte';
	import Text from './Text.svelte';
	import InlineCode from './InlineCode.svelte';

	export let children = [];
</script>

<blockquote class="border-l-8 border-l-blue-300 pl-4 py-1">
	{#each children as child}
		{#if child.type == 'text'}
			<Text content={child.content} />
		{:else if child.type == 'link'}
			<Link text={child.text} url={child.url} />
		{:else if child.type == 'code'}
			<InlineCode content={child.content} />
		{/if}
	{/each}
</blockquote>
