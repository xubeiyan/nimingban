<script>
	export let data;
</script>

<div class="container m-auto">
	<h1 class="text-3xl py-4">
		{data.board_name}
	</h1>
	<p class="bg-slate-200 dark:bg-slate-800 rounded-md px-4 py-2 shadow-inner mb-10">
		{data.board_intro}
	</p>
	{#if data.posts.length == 0}
		<div class="rounded-md border border-red-600 bg-red-200 p-4 my-2">
			<span>似乎这个版块没有任何串...</span>
		</div>
	{:else}
		{#each data.posts as post}
			<div class="rounded-md bg-slate-100 dark:bg-sky-800 px-4 py-2 mt-4 shadow-inner">
				<p class="space-x-2">
					<a href="#id-{post.id}">
						<span>No: {post.id}</span>
					</a>
					<span class="dark:text-green-100 font-bold">标题：{post.title}</span>
					<span class="dark:text-yellow-100">作者：{post.author}</span>
					<span class="italic">邮箱：{post.email}</span>
				</p>
				<div class="border border-cyan-600 mt-2 py-2 px-4 rounded-sm">
{post.content}
        </div>
			</div>
		{/each}
	{/if}
</div>
