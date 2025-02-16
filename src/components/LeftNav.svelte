<script>
	import { userStore } from '../store/userStore';
	import ForumList from './LeftNav/ForumList.svelte';
	import EditForumList from './LeftNav/EditForumList.svelte';

	import DoubleArrowIcon from '$svgIcon/doubleArrow.svelte';

	export let open;
	export let forums = [];
	// console.log(forumList);
	$: open_class = open ? 'translate-x-0' : 'translate-x-[-100%]';

	let editForumList = null;

	const openEditForumList = () => {
		if (editForumList == null) return;
		editForumList.showForm();
	};
</script>

<div
	class="fixed w-full h-screen z-10 {open_class} bg-slate-800/20 dark:bg-white/20 transition-transform duration-500 ease-in-out"
>
	<div class="container flex gap-4 h-[95%] m-auto">
		<div class="relative w-[15em] bg-sky-100 dark:bg-sky-800 h-full p-4 shrink-0">
			{#if $userStore.type == 'admin'}
				<button
					class="absolute bottom-4 right-4 bg-violet-200/70 hover:bg-violet-200
					dark:bg-violet-800/70 hover:dark:bg-violet-800
					px-2 py-1 rounded-md
					flex justify-center items-center"
					on:click={openEditForumList}
				>
					管理版块
					<DoubleArrowIcon />
				</button>
			{/if}
			<ForumList {forums} on:click />
		</div>
		<EditForumList bind:this={editForumList} />
	</div>
</div>
