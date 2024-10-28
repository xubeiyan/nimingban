<script>
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	import PostContent from './PostContent.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';

	export let postId = null;

	let comments = [];
	let rowCount = null;

	const getCommentMutation = createMutation({
		mutationFn: async () => {
			const res = await fetch(`/comment/latest/${postId}`).then((r) => r.json());
			comments = res.comments;
			rowCount = res.rowCount;
		}
	});

	onMount(() => {
		if (postId != null) {
			$getCommentMutation.mutate();
		}
	});
</script>

<div class="rounded-b-md bg-slate-200 p-4 dark:bg-sky-700 shadow-inner">
	{#if $getCommentMutation.isPending}
		<div class="flex gap-2 items-center">
			<LoadingIcon />
			<span> 正在获取最新回复</span>
		</div>
	{:else if $getCommentMutation.isSuccess}
		{#if comments.length == 0}
			<span class="text-slate-400">没有回复</span>
		{:else}
			{#if rowCount > 5}
				<p class="shadow-inner p-2 mb-2 rounded-md bg-gray-300 dark:bg-sky-900">
					<span>此为最新 5 条回复，共 {rowCount} 条回复，点击右上角“详情”查看</span>
				</p>
			{/if}
			{#each comments as comment}
				<div class="rounded-md odd:bg-slate-300 dark:odd:bg-sky-800 px-4 py-2">
					<p class="space-x-2">
						<span class="font-bold">标题：{comment.title}</span>
						<span>作者：{comment.poster_name}</span>
						<span class="italic">邮箱：{comment.poster_email}</span>
						<span>写于：{comment.comment_time}</span>
						<span>饼干：{comment.cookies_content}</span>
					</p>
					<div class="border border-cyan-600 mt-1 py-2 px-4 rounded-sm">
						<PostContent content={comment.content} on:largeImage />
					</div>
				</div>
			{/each}
		{/if}
	{/if}
</div>
