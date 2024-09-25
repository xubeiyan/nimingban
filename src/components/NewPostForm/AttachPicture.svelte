<script>
	export let attachFile = {};

	import CloseIcon from '$svgIcon/close.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const removeImage = (id) => {
		dispatch('removeImage', {
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
		class="absolute size-[2em] right-0 top-0 flex justify-center items-center bg-slate-100/50 dark:bg-red-600/50 opacity-0 hover:opacity-100"
		on:click={() => removeImage(attachFile.id)}
	>
		<CloseIcon />
	</button>
</div>
