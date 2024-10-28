<script>
	export let data;
	import { onMount } from 'svelte';
	import { createMutation } from '@tanstack/svelte-query';

	import SendForm from '../../../components/SendForm.svelte';
	import PostContent from '../../../components/PostContent.svelte';
	import ImageViewer from '../../../components/ImageViewer.svelte';
	import BackIcon from '$svgIcon/back.svelte';

	import { boardStore } from '../../../store/boardStore';
	import SecondaryBtn from '../../../components/SecondaryBtn.svelte';
	import PrimaryBtn from '../../../components/PrimaryBtn.svelte';

	let imageViewer = null;
	let newCommentForm = null;

	let comments = [];
	let fetchDataText = '加载中...';

	let GET_SIZE = 0;

	// 打开图片预览
	const openImageViewer = (url) => {
		if (imageViewer == null) return;

		imageViewer.openDialog(url);
	};

	// 打开评论框
	const openCommentForm = (fromCommentId) => {
		if (newCommentForm == null) return;
		if (fromCommentId != undefined) {
			const content = `> 回复 [此串](#id-${fromCommentId})`;
			newCommentForm.showForm({ content });
			return;
		}

		newCommentForm.showForm();
	};

	//
	const getCommentMutation = createMutation({
		mutationFn: async () => {
			const post_id = window.location.href.split('/').at(-1);
			const res = await fetch(`/comment/${post_id}?from=${$boardStore.comment_from}`).then((r) =>
				r.json()
			);

			GET_SIZE = res.getSize;

			let ids = comments.map((c) => c.id);

			// 合并现有和获取到的
			res.comments.forEach((newComment) => {
				// 如果获取到的评论有存在的，代表有新评论发表
				// 需要删除原有老评论
				if (ids.includes(newComment.id)) {
					ids = ids.filter((id) => id != newComment.id);
				}
			});
			const filteredComments = comments.filter((c) => ids.includes(c.id));

			comments = [...filteredComments, ...res.comments];

			boardStore.update((old) => {
				return {
					...old,
					comment_from: comments.length + res.getSize,
					comment_total: res.totalComment
				};
			});

			window.localStorage.setItem('board', JSON.stringify($boardStore));

			if ($boardStore.comment_from > $boardStore.comment_total) {
				fetchDataText = '没有更多了';
			}
		}
	});

	// 处理发送
	const handleSendComment = () => {
		// 如果已经在最后一页
		if ($boardStore.comment_from > $boardStore.comment_total) {
			boardStore.update((b) => {
				return {
					...b,
					comment_from: b.comment_from - GET_SIZE
				};
			});

			$getCommentMutation.mutateAsync();
		}
	};

	// 是否post_author
	$: post_author = (c) => {
		if (data.post.cookies_content == undefined) return '';
		return c == data.post.cookies_content ? 'po' : '';
	};

	let postId = null;

	onMount(() => {
		boardStore.update((b) => {
			return {
				...b,
				comment_from: 0,
				comment_total: 0
			};
		});

		$getCommentMutation.mutateAsync();

		let observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if ($boardStore.from > $boardStore.total) {
						fetchDataText = '没有更多了';
						return;
					}
					$getCommentMutation.mutateAsync();
				}
			});
		}, {});

		const getMore = document.querySelector('#getMore');
		if (getMore == undefined) return;

		observer.observe(getMore);
	});
</script>

<div class="container m-auto">
	<div class="mt-4">
		<a href={`/board/${$boardStore.boardUrl}`}>
			<PrimaryBtn>
				<BackIcon />
				<span>返回版块</span>
			</PrimaryBtn>
		</a>
	</div>
	<div
		class="rounded-md bg-slate-100 dark:bg-sky-800 px-4 py-2 mt-2 shadow-inner"
		id="id-{data.post.id}"
	>
		<div class="flex justify-between items-end">
			<p class="space-x-2">
				<span class="dark:text-green-100 font-bold">标题：{data.post.title}</span>
				<span class="dark:text-yellow-100">作者：{data.post.author}</span>
				<span class="dark:text-red-100 italic">邮箱：{data.post.email}</span>
				<span>写于：{data.post.post_time}</span>
				{#if data.post.edit_time != null}
					<span>编辑于：{data.post.edit_time}</span>
				{/if}
				<span class="dark:text-indigo-100">饼干: {data.post.cookies_content}</span>
			</p>
			{#if data.post.status == 'repliable'}
				<SecondaryBtn on:click={() => openCommentForm()}>回复</SecondaryBtn>
			{:else if data.post.status == 'readonly'}
				<span
					class="shadow-inner shadow-slate-300 dark:shadow-slate-900 rounded-md px-2 py-1 bg-orange-100 dark:bg-orange-800"
					>此串不允许回复</span
				>
			{/if}
		</div>
		<div class="border border-cyan-600 mt-2 py-2 px-4 rounded-sm">
			<PostContent content={data.post.content} on:largeImage={(e) => openImageViewer(e.detail)} />
		</div>
	</div>
	{#each comments as comment}
		<div
			class="rounded-md bg-slate-100 dark:bg-sky-800 px-4 py-2 mt-2 shadow-inner"
			id="id-{comment.id}"
		>
			<div class="flex justify-between items-end">
				<p class="space-x-2">
					<span class="dark:text-green-100 font-bold">标题：{comment.title}</span>
					<span class="dark:text-yellow-100">作者：{comment.poster_name}</span>
					<span class="dark:text-red-100 italic">邮箱：{comment.poster_email}</span>
					<span>写于：{comment.comment_time}</span>
					{#if comment.edit_time != null}
						<span>编辑于：{comment.edit_time}</span>
					{/if}
					<span class="dark:text-indigo-100">饼干: {comment.cookies_content} </span>
					{#if post_author(comment.cookies_content) != ''}
						<span
							class="shadow-inner shadow-slate-300 dark:shadow-slate-700 bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded-md"
						>
							{post_author(comment.cookies_content)}
						</span>
					{/if}
				</p>
				{#if data.post.status == 'repliable'}
					<SecondaryBtn on:click={() => openCommentForm(comment.id)}>回复</SecondaryBtn>
				{:else if data.post.status == 'readonly'}
					<span class="shadow-inner rounded-md px-2 py-1 bg-orange-100 dark:bg-orange-800"
						>此串不允许回复</span
					>
				{/if}
			</div>
			<div class="border border-cyan-600 mt-2 py-2 px-4 rounded-sm">
				<PostContent content={comment.content} on:largeImage={(e) => openImageViewer(e.detail)} />
			</div>
		</div>
	{/each}

	{#if data.post.id}
		<div class="rounded-md bg-sky-200 dark:bg-sky-400/50 p-4 my-2 mt-4" id="getMore">
			<span>{fetchDataText}</span>
		</div>
	{/if}
</div>
<SendForm bind:this={newCommentForm} type="comment" on:sendComment={handleSendComment} />
<ImageViewer bind:this={imageViewer} />
