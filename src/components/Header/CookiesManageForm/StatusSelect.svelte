<script>
	import LoadingIcon from '$svgIcon/loading.svelte';

	import { createMutation } from '@tanstack/svelte-query';
	import { userStore } from '../../../store/userStore';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let id = null;
	export let type = null;
	export let status = 'disable';

	$: placeStyle = status == 'disable' ? '' : 'translate-x-[100%]';
	$: bgStyle =
		status == 'disable' ? 'bg-red-100 dark:bg-red-700' : 'bg-lime-100 dark:bg-lime-600';

	let loading = false;

	const toggleStatus = async () => {
		const res = await $toggleMutation.mutateAsync();

		if (res.type == 'ok') {
			dispatch('updateStatus', {
				type,
				id,
				status: status == 'disable' ? 'enable' : 'disable'
			});
		}
	};

	const toggleMutation = createMutation({
		mutationFn: async () => {
			loading = true;

			let headers = {};

			// 有userStore.token字段则附上
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			const res = await fetch('/manage/toggleUserStatus', {
				method: 'POST',
				body: JSON.stringify({
					type,
					id,
					status: status == 'disable' ? 'enable' : 'disable'
				}),
				headers
			}).then((r) => r.json());

			loading = false;
			return res;
		}
	});
</script>

<button
	class="relative shadow-inner shadow-slate-300 dark:shadow-slate-700 w-[5em] self-center flex justify-around rounded-md {bgStyle}"
	on:click={toggleStatus}
>
	<div class="absolute left-0 transition duration-300 {placeStyle} w-[50%] h-full p-0.5">
		<div
			class="w-full h-full bg-blue-200 hover:bg-sky-200
        dark:bg-cyan-600 hover:dark:bg-sky-600
         shadow-sm shadow-slate-400 dark:shadow-slate-800 rounded-md
         flex justify-center items-center"
		>
			{#if loading}
				<LoadingIcon />
			{/if}
		</div>
	</div>
	<span>启用</span>
	<span>禁用</span>
</button>
