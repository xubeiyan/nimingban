<script>
	import CloseIcon from '$svgIcon/close.svelte';
	export let place = 'inBorder';

	$: styleType =
		place == 'onBorder' ? 'right-0 top-0 translate-x-[50%] translate-y-[-50%]' : 'right-2 top-2';
</script>

<button
	class="absolute {styleType} rounded-full size-[2em] bg-red-300 dark:bg-red-700
flex justify-center items-center
hover:outline outline-offset-1 outline-red-500"
	on:click
>
	<CloseIcon />
</button>
