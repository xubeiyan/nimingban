<script>
	import XSquareIcon from '$svgIcon/xSquare.svelte';
	import AlertTriangleIcon from '$svgIcon/alertTriangle.svelte';

	export let message = '';
	export let type = 'info';

	$: borderStyle =
		type == 'info' ? 'border-slate-400' : type == 'warning' ? 'border-amber-400 dark:border-amber-500' : 'border-red-400';
	$: bgStyle = type == 'info' ? 'bg-slate-200' : type == 'warning' ? 'bg-amber-100 dark:bg-amber-500' : 'bg-red-100 dark:bg-red-300';
	$: textStyle =
		type == 'info' ? 'text-slate-400' : type == 'warning' ? 'text-amber-500 dark:text-amber-900' : 'text-red-500 dark:text-red-800';
</script>

<div class="w-full flex justify-center">
	<div class="w-[30em] border {borderStyle} {bgStyle} rounded-md p-4 flex gap-2 items-center">
		{#if type == 'error'}
			<XSquareIcon />
		{:else if type == 'warning'}
			<AlertTriangleIcon />
		{/if}
		<span class={textStyle}>{message}</span>
	</div>
</div>
