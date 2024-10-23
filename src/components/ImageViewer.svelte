<script>
	import CloseIcon from '$svgIcon/close.svelte';

	let dialog = null;
	let imageUrl = null;

	export const openDialog = (url) => {
		if (dialog == null) return;
		imageUrl = url;
		dialog.showModal();
	};

	const closeDialog = () => {
		if (dialog == null) return;
		imageUrl = null;
		dialog.close();
	};
</script>

<dialog class="backdrop:backdrop-blur-sm overflow-hidden" bind:this={dialog}>
	<button
		class="absolute right-2 top-2 rounded-full size-[2em] bg-red-300 dark:bg-red-700
        flex justify-center items-center
        hover:outline outline-offset-1 outline-red-500"
		on:click={closeDialog}
	>
		<CloseIcon />
	</button>
	<img class="max-w-screen" alt src={imageUrl} />
</dialog>
