<script>
	import LoadingIcon from '$svgIcon/loading.svelte';
	import { createMutation } from '@tanstack/svelte-query';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let id = null;

	const removeUser = createMutation({
		mutationFn: async () => {
			if (id == null) return;

			const res = await fetch(`/install/manageAdmin/removeUser/${id}`).then((r) => r.json());
			if (res.type == 'ok') {
				dispatch('deleteSuccess', { id });
			}
		}
	});
</script>

<button
	class="bg-red-200 dark:bg-red-700 px-2 rounded-md flex items-center gap-1"
	disabled={$removeUser.isPending}
	on:click={() => $removeUser.mutate()}
>
	{#if $removeUser.isPending}
		<LoadingIcon />
	{/if}
	删除</button
>
