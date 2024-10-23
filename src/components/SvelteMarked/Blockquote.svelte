<script>
	import Link from './Link.svelte';
	import Text from './Text.svelte';

	export let children = [];
</script>

<blockquote class="border-l-8 border-l-blue-400 pl-4">
	{#each children as child}
		{#if child.type == 'text'}
			<Text content={child.content} />
		{:else if child.type == 'link'}
			<Link text={child.text} url={child.url} />
		{/if}
	{/each}
</blockquote>
