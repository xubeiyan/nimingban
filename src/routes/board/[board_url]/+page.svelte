<script>
	import { onMount } from 'svelte';
	import { boardStore } from '../../../store/boardStore';

	import SendForm from '../../../components/SendForm.svelte';
	import PostContent from '../../../components/PostContent.svelte';
	import ImageViewer from '../../../components/ImageViewer.svelte';

	import { createMutation } from '@tanstack/svelte-query';
	import SecondaryBtn from '../../../components/SecondaryBtn.svelte';
	import PrimaryBtn from '../../../components/PrimaryBtn.svelte';
	import ErrorPage from '../../../components/ErrorPage.svelte';
	import CommentArea from '../../../components/CommentArea.svelte';

	export let data;

	let posts = [];
	let fetchDataText = '加载中...';

	const getPostMutation = createMutation({
		mutationFn: async () => {
			const res = await fetch(
				`/board/getPosts/${$boardStore.boardUrl}?from=${$boardStore.from}`
			).then((r) => r.json());

			let ids = posts.map((post) => post.id);

			// 合并现有和获取到的
			res.posts.forEach((newPost) => {
				// 如果获取到的串有存在的，代表有新串发表
				// 导致老串下移，则需要删除原有老串
				if (ids.includes(newPost.id)) {
					ids = ids.filter((id) => id != newPost.id);
				}
			});
			const filteredPosts = posts.filter((post) => ids.includes(post.id));
			posts = [...filteredPosts, ...res.posts];
			boardStore.update((old) => {
				return {
					...old,
					from: old.from + res.getSize,
					total: res.totalPost
				};
			});

			window.localStorage.setItem('board', JSON.stringify($boardStore));

			if ($boardStore.from > $boardStore.total) {
				fetchDataText = '没有更多了';
			}
		}
	});

	let newPostForm = null;
	let imageViewer = null;

	const showNewPostForm = () => {
		if (newPostForm == null) return;
		newPostForm.showForm();
	};

	const handleSendPost = () => {
		boardStore.update((old) => {
			return {
				...old,
				from: 0,
				total: 0
			};
		});
		posts = [];
		fetchDataText = '加载中...';
		$getPostMutation.mutateAsync();
	};

	// 打开图片预览
	const openImageViewer = (url) => {
		if (imageViewer == null) return;

		imageViewer.openDialog(url);
	};

	// 获取

	onMount(() => {
		boardStore.update((b) => {
			const boardUrl = window.location.href.split('/').at(-1);
			return { ...b, from: 0, boardUrl };
		});

		window.localStorage.setItem('board', JSON.stringify($boardStore));

		//
		let observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if ($boardStore.from > $boardStore.total) {
						fetchDataText = '没有更多了';
						return;
					}
					$getPostMutation.mutateAsync();
				}
			});
		}, {});

		const getMore = document.querySelector('#getMore');
		if (getMore == undefined) return;

		observer.observe(getMore);
	});
</script>

<div class="container m-auto">
	{#if data.type == 'error'}
		<ErrorPage message="访问的地址不存在" />
	{:else}
		<h1 class="text-3xl py-4">
			{data.name}
		</h1>
		<p
			class="bg-slate-200 dark:bg-slate-800/50 rounded-md px-6 py-4 shadow-inner shadow-slate-300 dark:shadow-slate-800 mb-4"
		>
			<PostContent content={data.intro} />
		</p>
		<p>
			<PrimaryBtn on:click={showNewPostForm}>发新串</PrimaryBtn>
		</p>
	{/if}
	{#each posts as post}
		<div
			class="rounded-t-md bg-slate-100 dark:bg-sky-800
			px-4 py-2 mt-4 shadow-inner"
			id="id-{post.id}"
		>
			<div class="flex justify-between items-end">
				<p class="space-x-2">
					<a href="#id-{post.id}">
						<span class="dark:text-green-100 font-bold">标题：{post.title}</span>
					</a>
					<span class="dark:text-yellow-100">作者：{post.author}</span>
					<span class="dark:text-red-100 italic">邮箱：{post.email}</span>
					<span>写于：{post.post_time}</span>
					<span class="dark:text-indigo-100">饼干: {post.cookies_content}</span>
				</p>
				<a href="/post/{post.id}">
					<SecondaryBtn>详情</SecondaryBtn>
				</a>
			</div>
			<div class="border border-cyan-600 mt-2 py-2 px-4 rounded-sm">
				<PostContent content={post.content} on:largeImage={(e) => openImageViewer(e.detail)} />
			</div>
		</div>
		<CommentArea postId={post.id} on:largeImage={(e) => openImageViewer(e.detail)} />
	{/each}
	{#if data.name}
		<div class="rounded-md bg-sky-200 dark:bg-sky-400/50 p-4 my-2 mt-4" id="getMore">
			<span>{fetchDataText}</span>
		</div>
	{/if}
</div>

<SendForm bind:this={newPostForm} type="post" on:sendPost={handleSendPost} />
<ImageViewer bind:this={imageViewer} />
