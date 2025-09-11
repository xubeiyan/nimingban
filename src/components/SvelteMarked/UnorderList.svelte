<script>
	import OrderItem from './OrderItem.svelte';
	export let children = [];
</script>

<ul class="list-disc list-inside">
	{#each children as child}
		{#if child.level == 1}
			<li>
				<OrderItem children={child.content} />
			</li>
		{:else if child.level == 2}
			<li class="list-[square] ml-4">		
				<OrderItem children={child.content} />
			</li>
		{:else if child.level == 3}
			<li class="list-[circle] ml-8">		
				<OrderItem children={child.content} />
			</li>
		{/if}
	{/each}
</ul>
