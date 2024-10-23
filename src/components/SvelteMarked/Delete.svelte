<script>
	import Text from './Text.svelte';

	export let children = [];
</script>

<s>
	{#each children as child}
		<Text content={child.content} />
	{/each}
</s>
