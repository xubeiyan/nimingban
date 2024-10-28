<script>
	export let forums = [];
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
					<a href={`/board/${board.board_url}`} data-sveltekit-reload>
						<button
							class="bg-sky-200 hover:bg-cyan-200/70 dark:bg-sky-900 dark:hover:bg-cyan-800/70 px-2 py-1 rounded-md w-full text-left"
						>
							{board.board_name}
						</button>
					</a>
				</li>
			{/each}
		</ul>
	{/each}
</ul>
