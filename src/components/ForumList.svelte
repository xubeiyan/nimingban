<script>
    export let forums = [];
</script>
<ul>
    {#each forums as forum}
        <li>{forum.section_name}</li>
        <ul class="pl-4">
            {#each forum.boards as board}
                <li>{board.board_name}</li>
            {/each}
        </ul>
    {/each}
</ul>