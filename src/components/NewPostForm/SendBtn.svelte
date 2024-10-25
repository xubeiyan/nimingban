<script>
	import LoadingIcon from '$svgIcon/loading.svelte';

	export let status = 'idle';
	export let type = 'post';

	$: verb = type == 'post' ? '发串' : '回复串';

	$: text =
		status == 'idle'
			? '发送'
			: status == 'sending'
				? '发送中...'
				: status == 'failed'
					? `${verb}失败，重试`
					: `${verb}完成`;
	$: btnClass = ['idle', 'failed'].includes(status)
		? 'bg-slate-300/50 dark:bg-slate-50/20 dark:bg-slate-50/10 hover:dark:bg-slate-50/20 hover:shadow-md'
		: '';
</script>

<button
	type="submit"
	class="{btnClass} px-3 py-1 rounded-md flex gap-1 items-center"
	disabled={['sending', 'ok'].includes(status)}
	on:click
>
	{#if status == 'sending'}
		<LoadingIcon />
	{/if}
	<span>{text}</span></button
>
