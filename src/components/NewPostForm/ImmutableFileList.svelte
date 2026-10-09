<script>
	import InsertImageIcon from '$svgIcon/insertImage.svelte';

	import { createMutation } from '@tanstack/svelte-query';
	import { createEventDispatcher, onMount } from 'svelte';

  export let postID = "";
	let list = [];
	const dispatch = createEventDispatcher();

	const insertImageToPost = (filename) => {
		dispatch('insertImageToPost', {
			path: `/images/${filename}`
		});
	};

	// 请求该串的图像
	const getImagesFromPostOrCommentMutation = createMutation({
		mutationFn: async (id) => {
			const res = await fetch(`/getImages/fromPostOrComment/${id}`).then((r) => r.json());
			if (res.type == 'ok') {
				list = res.images;
			}
		}
	});

  onMount(() => {
    if (postID == "") return;
    $getImagesFromPostOrCommentMutation.mutate(postID);
  })

</script>

<div class="flex gap-4 mt-2">
	{#each list as image_file_name}
		<div class="relative">
			<img
				class="size-20 rounded-md object-cover object-center"
				src={`/images/${image_file_name}`}
				alt="edit"
			/>
			<button
				class="absolute w-full h-[2em] bottom-0 bg-gray-300/60 dark:bg-gray-600/60
            flex justify-center items-center opacity-80 hover:opacity-100"
				type="button"
				on:click={() => insertImageToPost(image_file_name)}
			>
				<InsertImageIcon />
			</button>
		</div>
	{/each}
</div>
