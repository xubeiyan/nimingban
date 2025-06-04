<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let alt = '';
	export let url = '';
	export let title = '';

	$: inSketch = url.includes('TEMPFOLDER');
	$: realUrl = inSketch ? '/attach_placeholder.png' : url;

	$: centerImage = title != '' && title != null;
	$: centerImageStyle = centerImage ? 'items-center': '';

	const fullScreenView = (url) => {
		// TODO: 打开一个大窗口查看图片
		dispatch('largeImage', url);
	};
</script>

<div class="flex flex-col {centerImageStyle}">
	<button on:click={() => fullScreenView(url)} disabled={inSketch}>
		<img class="min-h-[10em] max-h-[20em]" {alt} src={realUrl} />
	</button>
	{#if centerImage}
		<span class="italic">{title}</span>
	{/if}
</div>
