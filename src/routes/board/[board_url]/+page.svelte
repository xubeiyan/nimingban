<script>
	import NewPostForm from '../../../components/NewPostForm.svelte';
	import PostContent from '../../../components/PostContent.svelte';

	import { createQuery } from '@tanstack/svelte-query';

	export let data;

	$: posts = createQuery({
		queryKey: ['getPosts'],
		queryFn: async () =>
			await fetch(`/board/getPosts?board_id=${data.board_id}`).then((r) => r.json())
	});

	let newPostForm = null;

	const showNewPostForm = () => {
		if (newPostForm == null) return;
		newPostForm.showForm();
	};

	const handleSendPost = () => {
		$posts.refetch();
	};
</script>

<div class="container m-auto">
	<h1 class="text-3xl py-4">
		{data.name}
	</h1>
	<p
		class="bg-slate-200 dark:bg-slate-800/50 rounded-md px-4 py-2 shadow-inner shadow-slate-300 dark:shadow-slate-800 mb-4"
	>
		{data.intro}
	</p>
	<p>
		<button
			class="bg-sky-100 shadow-md dark:bg-sky-500 rounded-md py-1 px-3"
			on:click={showNewPostForm}>发新串</button
		>
	</p>
	{#if $posts.isLoading}
		<div class="rounded-md bg-sky-200 dark:bg-sky-400/50 p-4 my-2">
			<span>获取数据...</span>
		</div>
	{:else if $posts.data?.type == 'error'}
		<div class="rounded-md bg-yellow-200 dark:bg-yellow-400/50 p-4 my-2">
			<span>错误：{$posts.data.errorCode}</span>
		</div>
	{:else if $posts.isSuccess && $posts.data.length == 0}
		<div class="rounded-md bg-red-200 dark:bg-red-400/50 p-4 my-2">
			<span>这个版块看起来没有任何串...</span>
		</div>
	{:else if $posts.isSuccess}
		{#each $posts.data as post}
			<div class="rounded-md bg-slate-100 dark:bg-sky-800 px-4 py-2 mt-4 shadow-inner">
				<div class="flex justify-between items-end">
					<p class="space-x-2">
						<a href="#id-{post.id}">
							<span class="dark:text-green-100 font-bold">标题：{post.title}</span>
						</a>
						<span class="dark:text-yellow-100">作者：{post.author}</span>
						<span class="italic">邮箱：{post.email}</span>
						<span>写于：{post.post_time}</span>
						<span>饼干: {post.cookies_content}</span>
					</p>
					<button class="bg-sky-100 shadow-md dark:bg-sky-500 rounded-md py-1 px-3">回复</button>
				</div>
				<div class="border border-cyan-600 mt-2 py-2 px-4 rounded-sm">
					<PostContent content={post.content} />
				</div>
			</div>
		{/each}
	{/if}
</div>

<NewPostForm bind:this={newPostForm} on:sendPost={handleSendPost} />
