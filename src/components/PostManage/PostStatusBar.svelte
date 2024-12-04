<script>
	import EditIcon from '$svgIcon/edit.svelte';
	import TrashIcon from '$svgIcon/trash.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let status = null;

	const statusTextArray = {
		repliable: '可回复',
		readonly: '仅查看',
		hidden: '隐藏'
	};

	const openDeleteDialog = () => {
		dispatch('openDeleteDialog');
	};

	$: statusText = statusTextArray[status] == undefined ? '未知状态' : statusTextArray[status];
	$: bgStyle =
		status == 'repliable'
			? 'bg-green-100 dark:bg-green-500/60'
			: status == 'readonly'
				? 'bg-yellow-100 dark:bg-yellow-500/60'
				: status == 'hidden'
					? 'bg-red-100 dark:bg-red-500/60'
					: '';
</script>

<div
	class="shadow-inner shadow-slate-200 dark:shadow-sky-700 pl-2 pr-1 py-1 {bgStyle} rounded-md flex items-center gap-1"
>
	<span>{statusText}</span>
	{#if status == 'hidden'}
		<button
			class="flex justify-center items-center
		rounded-sm size-[1.5em] 
		bg-red-300/50 hover:bg-red-300/80
		dark:bg-red-500/30 dark:hover:bg-red-500/50"
			on:click={openDeleteDialog}
		>
			<TrashIcon size="1.25em" />
		</button>
	{/if}
	<button
		class="bg-indigo-100/80 hover:bg-indigo-100
	  dark:bg-sky-700 dark:hover:bg-sky-700/80
	 	shadow-sm shadow-slate-300 dark:shadow-sky-800 rounded-sm size-[1.5em]
		flex justify-center items-center"
		on:click
	>
		<EditIcon />
	</button>
</div>
