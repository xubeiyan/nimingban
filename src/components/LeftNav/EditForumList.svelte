<script>
    import { userStore } from '../../store/userStore';

	import CloseIcon from '$svgIcon/close.svelte';
	import PlusIcon from '$svgIcon/plus.svelte';

	import SingleSection from './EditForumList/SingleSection.svelte';
	import NewSection from './EditForumList/NewSection.svelte';

	import { createMutation } from '@tanstack/svelte-query';

	let open = false;
	let forums = [];

	export const showForm = () => {
		open = true;
		$fetchForumList.mutate();
	};

	const closeForm = () => {
		forums = [];
		open = false;
	};

	$: showStyle = open ? '' : 'hidden';

	let sectionAdd = null;

	const fetchForumList = createMutation({
		mutationFn: async () => {
            let headers = {};
            if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}
            
			const res = await fetch('/manage/getForumList', {
                headers
            }).then((r) => r.json());
			if (res.type != 'ok') {
				return;
			}

			forums = res.forumList;
		}
	});
</script>

<div
	class="relative grow {showStyle} px-4 py-2
    bg-sky-100 dark:bg-sky-800 overflow-y-auto"
>
	<button class="absolute right-4 top-4" on:click={closeForm}>
		<CloseIcon />
	</button>
	<h1 class="text-2xl my-4">版块管理</h1>
	{#if $fetchForumList.isPending}
		<p>获取板块列表...</p>
	{:else if $fetchForumList.isSuccess}
		<ul class="space-y-1 max-h-full">
			{#each forums as forum}
				<SingleSection {forum} on:updateAllSectionBoard={() => $fetchForumList.mutate()} />
			{/each}
			<li
				class="w-full h-[4em]
        bg-violet-200/70 dark:bg-indigo-400/30
        hover:bg-violet-200 dark:hover:bg-indigo-400/50
        rounded-md mt-1"
			>
				{#if sectionAdd == null}
					<button class="w-full h-full flex justify-center items-center">
						<PlusIcon size="1.5em" />
					</button>
				{:else}
					<NewSection />
				{/if}
			</li>
		</ul>
	{/if}
</div>
