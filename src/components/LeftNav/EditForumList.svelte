<script>
	import CloseIcon from '$svgIcon/close.svelte';
	import PlusIcon from '$svgIcon/plus.svelte';

	import SingleSection from './EditForumList/SingleSection.svelte';

	let open = false;
	let forums = [];

	export const showForm = (outForums) => {
		forums = outForums;
		open = true;
	};

	const closeForm = () => {
		forums = [];
		open = false;
	};
	$: showStyle = open ? '' : 'hidden';

	const handleUpdate = (e) => {
		const { type, section_id, board_id, value } = e.detail;

		if (type == 'section_name') {
			const filtered = forums.filter((section) => section.section_id == section_id);
			if (filtered.length != 1) return;
			filtered[0].section_name_new = value;
		} else if (['board_name', 'board_url', 'intro'].includes(type)) {
			const filteredSection = forums.filter((s) => s.section_id == section_id);

			if (filteredSection.length != 1) return;
			const filtered = filteredSection[0].boards.filter((b) => b.board_id == board_id);
			if (filtered.length != 1) return;

			if (type == 'board_name') {
				filtered[0].board_name_new = value;
			} else if (type == 'board_url') {
				filtered[0].board_url_new = value;
			} else if (type == 'intro') {
				filtered[0].intro_new = value;
			}
		}
		forums = forums;
	};

	const handleUndo = (e) => {
		const { type, section_id, board_id } = e.detail;
		if (type == 'section_name') {
			const filtered = forums.filter((section) => section.section_id == section_id);

			if (filtered.length != 1) return;
			filtered[0].section_name_new = undefined;
		} else if (['board_name', 'board_url', 'intro'].includes(type)) {
			const filteredSection = forums.filter((s) => s.section_id == section_id);

			if (filteredSection.length != 1) return;
			const filtered = filteredSection[0].boards.filter((b) => b.board_id == board_id);
			if (filtered.length != 1) return;

			if (type == 'board_name') {
				filtered[0].board_name_new = undefined;
			} else if (type == 'board_url') {
				filtered[0].board_url_new = undefined;
			} else if (type == 'intro') {
				filtered[0].intro_new = undefined;
			}
		}
		forums = forums;
	};

	const handleMove = (e) => {
		const { type, section_id, index } = e.detail;
		if (type == 'boardBackward') {
			if (index == 0) return;

			const filtered = forums.filter((s) => s.section_id == section_id);
			if (filtered.length != 1) return;
			const prev = filtered[0].boards[index - 1];

			filtered[0].boards[index - 1] = filtered[0].boards[index];
			filtered[0].boards[index] = prev;
		} else if (type == 'boardForward') {
			const filtered = forums.filter((s) => s.section_id == section_id);
			if (filtered.length != 1) return;

			if (index + 1 >= filtered[0].boards.length) return;

			const next = filtered[0].boards[index + 1];

			filtered[0].boards[index + 1] = filtered[0].boards[index];
			filtered[0].boards[index] = next;
		} else if (type == 'sectionBackward') {
			const index = forums.findIndex((s) => s.section_id == section_id);

			if (index == -1 || index == 0) return;

			const prev = forums[index - 1];
			forums[index - 1] = forums[index];
			forums[index] = prev;
		} else if (type == 'sectionForward') {
			const index = forums.findIndex((s) => s.section_id == section_id);

			if (index == -1 || index + 1 >= forums.length) return;

			const next = forums[index + 1];
			forums[index + 1] = forums[index];
			forums[index] = next;
		}

		forums = forums;
	};
</script>

<div
	class="relative grow {showStyle} px-4 py-2
    bg-sky-100 dark:bg-sky-800"
>
	<button class="absolute right-4 top-4" on:click={closeForm}>
		<CloseIcon />
	</button>
	<h1 class="text-2xl my-4">版块管理</h1>
	<!-- {JSON.stringify(forums)} -->
	<ul class="space-y-1 max-h-full">
		{#each forums as forum}
			<SingleSection {forum} on:undo={handleUndo} on:update={handleUpdate} on:move={handleMove} />
		{/each}
	</ul>
	<button
		class="flex justify-center items-center w-full h-[4em]
    bg-violet-200/70 dark:bg-indigo-400/30
    hover:bg-violet-200 dark:hover:bg-indigo-400/50
    rounded-md mt-1"
	>
		<PlusIcon size="1.5em" />
	</button>
</div>
