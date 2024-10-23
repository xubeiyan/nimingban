<script>
	import Text from './Text.svelte';

	export let children = [];
</script>

<blockquote class="border-l-8 border-l-blue-400 pl-4">
	{#each children as child}
		{#if child.type == 'text'}
			<Text content={child.content} />
		{/if}
	{/each}
</blockquote>
