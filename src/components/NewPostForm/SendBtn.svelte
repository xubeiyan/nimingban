<script>
	import LoadingIcon from '$svgIcon/loading.svelte';
	import SendIcon from '$svgIcon/send.svelte';

	export let status = 'idle';

	$: btnClass = ['idle', 'failed'].includes(status)
		? 'bg-slate-300/50 dark:bg-slate-50/20 dark:bg-slate-50/10 hover:dark:bg-slate-50/20 hover:shadow-md'
		: '';
</script>

<button
	type="submit"
	class="{btnClass} px-2 py-1 rounded-md flex gap-1 items-center"
	disabled={['sending', 'ok'].includes(status)}
	on:click
>
	{#if status == 'sending'}
		<LoadingIcon />
	{:else}
		<SendIcon />
	{/if}
</button>
