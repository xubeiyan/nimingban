<script>
	import XSquareIcon from '$svgIcon/xSquare.svelte';
	import AlertTriangleIcon from '$svgIcon/alertTriangle.svelte';
	import CheckCircleIcon from '$svgIcon/checkCircle.svelte';

	export let message = '';
	export let type = 'info';

	$: borderStyle =
		type == 'info'
			? 'border-slate-400'
			: type == 'warning'
				? 'border-amber-400 dark:border-amber-500'
				: type == 'success'
					? 'border-green-800 dark:border-green-300'
					: 'border-red-400';
	$: bgStyle =
		type == 'info'
			? 'bg-slate-200'
			: type == 'warning'
				? 'bg-amber-100 dark:bg-amber-500'
				: type == 'success'
					? 'bg-green-100 dark:bg-green-600'
					: 'bg-red-100 dark:bg-red-300';
	$: textStyle =
		type == 'info'
			? 'text-slate-400'
			: type == 'warning'
				? 'text-amber-500 dark:text-amber-900'
				: type == 'success'
					? 'text-green-800 dark:text-green-100'
					: 'text-red-500 dark:text-red-800';
</script>

<div class="w-full flex justify-center">
	<div class="w-[30em] border {borderStyle} {bgStyle} rounded-md p-4 flex gap-2 items-center">
		{#if type == 'error'}
			<XSquareIcon />
		{:else if type == 'warning'}
			<AlertTriangleIcon />
		{:else if type == 'success'}
			<CheckCircleIcon />
		{/if}
		<span class={textStyle}>{message}</span>
	</div>
</div>
