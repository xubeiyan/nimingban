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
					<a href={`/board/${board.board_url}`}>
						<button
							class="bg-sky-200/70 hover:bg-sky-200 dark:bg-sky-950/60 dark:hover:bg-sky-950 px-2 py-1 rounded-md w-full text-left"
							on:click
						>
							{board.board_name}
						</button>
					</a>
				</li>
			{/each}
		</ul>
	{/each}
</ul>
