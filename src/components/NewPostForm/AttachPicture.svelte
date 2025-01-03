<script>
	export let attachFile = {};

	import CloseIcon from '$svgIcon/close.svelte';
	import InsertImageIcon from '$svgIcon/insertImage.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const removeImage = (id) => {
		dispatch('removeImage', {
			id
		});
	};

	const copyImageMarkdown = (id) => {
		dispatch('insertImageToPost', {
			id
		});
	};
</script>

<div class="relative">
	<img
		class="size-16 object-cover object-center rounded-md"
		src={window.URL.createObjectURL(attachFile.fileContent)}
		alt="to upload"
	/>
	<button
		class="absolute size-[2em] right-0 top-0 flex justify-center items-center bg-red-400/80 dark:bg-red-600/50 opacity-0 hover:opacity-100"
		on:click={() => removeImage(attachFile.id)}
		type="button"
	>
		<CloseIcon />
	</button>
	<button
		class="absolute w-full h-[2em] bottom-0 bg-gray-300/60 dark:bg-gray-600/60 flex justify-center items-center opacity-0 hover:opacity-100"
		on:click={() => copyImageMarkdown(attachFile.id)}
		type="button"
	>
		<InsertImageIcon />
	</button>
</div>
