<script>
	import Text from './Text.svelte';
	export let children = [];
</script>

<strong>
	{#each children as child}
		<Text content={child.content} />
	{/each}
</strong>
