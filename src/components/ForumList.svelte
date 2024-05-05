<script>
	export let forums = [];

	const toBoard = (url) => {
		window.location.href = `/board/${url}`;
	};
</script>

<ul>
	{#each forums as forum}
		<li>
			<span class="inline-block py-1">
				{forum.section_name}
			</span>
		</li>
		<ul class="pl-4 space-y-1">
			{#each forum.boards as board}
				<li>
					<button
						class="border border-sky-200 bg-sky-200 hover:bg-cyan-400 px-2 py-1 rounded-md w-full text-left"
						on:click={() => toBoard(board.board_url)}
					>
						{board.board_name}
					</button>
				</li>
			{/each}
		</ul>
	{/each}
</ul>
