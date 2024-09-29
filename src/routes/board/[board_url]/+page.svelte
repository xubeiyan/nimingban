<script>
	import NewPostForm from '../../../components/NewPostForm.svelte';
	import PostContent from '../../../components/PostContent.svelte';

	export let data;

	let newPostForm = null;

	const showNewPostForm = () => {
		if (newPostForm == null) return;
		newPostForm.showForm();
	};

	const handleSendPost = () => {};
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
	{#if data.posts.length == 0}
		<div class="rounded-md bg-red-200 dark:bg-red-400/50 p-4 my-2">
			<span>这个版块看起来没有任何串...</span>
		</div>
	{:else}
		{#each data.posts as post}
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
