<script>
	import OrderItem from './OrderItem.svelte';
	export let start = 1;
	export let children = [];

	$: orderList = () => {
		if (children.length == 0) return [];

		const ret = [
			{
				content: children[0].content,
				level: 1,
				subList: []
			}
		];

		if (children.length == 1) return ret;

		// 从第二个元素开始遍历
		let level1Index = 1;
		let level2Index = 0;
		for (let i = 1; i < children.length; ++i) {
			const child = children[i];
			if (child.level == 1) {
				level2Index = 0;
				ret.push({
					content: child.content,
					level: 1,
					subList: []
				});
				level1Index += 1;
			} else if (child.level == 2) {
				const lastLevel1 = ret[level1Index - 1];
				const { content } = child;
				lastLevel1.subList.push({
					content,
					level: 2,
					subList: []
				});
				level2Index += 1;
			} else if (child.level == 3) {
				const lastLevel1 = ret[level1Index - 1];
				const lastLevel2 = lastLevel1.subList[level2Index - 1];
				if (lastLevel2 == undefined) continue;
				const { content, level } = child;
				lastLevel2.subList.push({
					content,
					level: 3,
					subList: []
				});
			}
		}

		return ret;
	};
</script>

<ol {start} class="list-decimal list-inside text-autospace">
	<!-- {JSON.stringify(orderList())} -->
	{#each orderList() as item}
		<li>
			<OrderItem children={item.content} />
			{#if item.subList.length > 0}
				<ol class="list-[lower-alpha] list-inside">
					{#each item.subList as subItem}
						<li class="ml-4">
							<OrderItem children={subItem.content} />
							{#if subItem.subList.length > 0}
								<ol class="list-[lower-roman] list-inside">
									{#each subItem.subList as subSubItem}
										<li class="ml-4">
											<OrderItem children={subSubItem.content} />
										</li>
									{/each}
								</ol>
							{/if}
						</li>
					{/each}
				</ol>
			{/if}
		</li>
	{/each}
</ol>
