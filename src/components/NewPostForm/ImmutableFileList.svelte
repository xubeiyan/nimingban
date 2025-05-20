<script>
	import InsertImageIcon from '$svgIcon/insertImage.svelte';
	export let list = [];

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const insertImageToPost = (filename) => {
		dispatch('insertImageToPost', {
			filename
		});
	};
</script>

<div>
	{#each list as image_file_name}
		<div class="relative">
			<img
				class="size-20 rounded-md object-cover object-center"
				src={`/images/${image_file_name}`}
				alt="edit"
			/>
			<button
				class="absolute w-full h-[2em] bottom-0 bg-gray-300/60 dark:bg-gray-600/60
            flex justify-center items-center opacity-0 hover:opacity-100"
				type="button"
				on:click={() => insertImageToPost(image_file_name)}
			>
				<InsertImageIcon />
			</button>
		</div>
	{/each}
</div>
