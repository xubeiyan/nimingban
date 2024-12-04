<script>
	import Text from './Text.svelte';
	import Emphasis from './Emphasis.svelte';
	import Strong from './Strong.svelte';

	export let children = [];

	let show = false;

	$: showStyle = show ? '' : 'bg-slate-600 text-slate-600 dark:bg-slate-300 dark:text-slate-300';

	const toggleShow = () => {
		show = !show;
	};
</script>

<button on:click={toggleShow} class="px-1 {showStyle}" type="button">
	{#each children as child}
		{#if child.type == 'text'}
			<Text content={child.content} />
		{:else if child.type == 'emphasis'}
			<Emphasis children={child.children} />
		{:else if child.type == 'strong'}
			<Strong children={child.children} />
		{/if}
	{/each}
</button>
