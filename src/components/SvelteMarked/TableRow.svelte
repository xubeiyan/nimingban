<script>
	import TableCell from './TableCell.svelte';

	export let children = [];
	export let type = 'body';
</script>

<tr>
	{#each children as child}
		<TableCell {type} children={child} />
	{/each}
</tr>
