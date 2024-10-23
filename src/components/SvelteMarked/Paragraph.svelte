<script>
	import Text from './Text.svelte';
	import Emphasis from './Emphasis.svelte';
	import Strong from './Strong.svelte';
	import Delete from './Delete.svelte';
	import InlineCode from './InlineCode.svelte';
	export let children = [];
</script>

<p>
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
		{/if}
	{/each}
</p>
