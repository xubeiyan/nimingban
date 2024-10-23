<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let alt = '';
	export let url = '';
	export let title = '';

	$: inSketch = url.includes('TEMPFOLDER');
	$: realUrl = inSketch ? '/attach_placeholder.png' : url;

	const fullScreenView = (url) => {
		// TODO: 打开一个大窗口查看图片
		dispatch('largeImage', url);
	};
</script>

<div class="flex items-center">
	<button on:click={() => fullScreenView(url)} disabled={inSketch}>
		<img class="h-[10em]" {alt} src={realUrl} {title} />
	</button>
	{#if inSketch}
		<span> ← {alt} 会被替换，hover文字为 {title}</span>
	{/if}
</div>
