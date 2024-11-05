<script>
	import OrderItem from './OrderItem.svelte';
	export let start = 1;
	export let children = [];
</script>

<ol {start} class="list-decimal list-inside">
	{#each children as child}
		<li>
			<OrderItem children={child.children} />
		</li>
	{/each}
</ol>
