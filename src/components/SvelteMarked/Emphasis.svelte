<script>
	import InlineCode from './InlineCode.svelte';
	import Strong from './Strong.svelte';
	import Text from './Text.svelte';
	export let children = [];
</script>

<em>
	{#each children as child}
		{#if child.type == 'text'}
			<Text content={child.content} />
		{:else if child.type == 'code'}
			<InlineCode content={child.content} />
		{:else if child.type == 'strong'}
			<Strong children={child.children} />
		{/if}
	{/each}
</em>
