<script>
	import OrderItem from './OrderItem.svelte';
	export let children = [];
</script>

<ul class="list-disc list-inside">
	{#each children as child}
		<li>
			<OrderItem children={child.children} />
		</li>
	{/each}
</ul>
