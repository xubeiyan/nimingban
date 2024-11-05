<script>
	import InlineCode from './InlineCode.svelte';
	import Text from './Text.svelte';
	
	export let children = [];
</script>

<strong>
	{#each children as child}
		{#if child.type == 'text'}
			<Text content={child.content} />
		{:else if child.type == 'code'}
			<InlineCode content={child.content} />
		{/if}
	{/each}
</strong>
