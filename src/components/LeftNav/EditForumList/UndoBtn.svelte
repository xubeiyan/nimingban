<script>
	import UndoIcon from '$svgIcon/undo.svelte';
	export let show = false;
</script>

<button
	class="bg-red-200 dark:bg-red-200/50
        size-[2em] rounded-md flex justify-center items-center
        {show ? '' : 'hidden'}"
	on:click
>
	<UndoIcon />
</button>
