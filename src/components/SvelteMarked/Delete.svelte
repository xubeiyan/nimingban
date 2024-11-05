<script>
	import Text from './Text.svelte';

	export let children = [];
</script>

<s class="text-red-600 dark:text-red-300">
	{#each children as child}
		<span class="text-gray-600 dark:text-gray-200"><Text content={child.content} /></span>
	{/each}
</s>
