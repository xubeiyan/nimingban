<script>
	import { onDestroy, onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	import { boardStore } from '../../../store/boardStore';
	import { userStore } from '../../../store/userStore';

	import SendForm from '$cmpns/SendForm.svelte';
	import PostContent from '$cmpns/PostContent.svelte';
	import ImageViewer from '$cmpns/ImageViewer.svelte';

	import { createMutation } from '@tanstack/svelte-query';
	import SecondaryBtn from '$cmpns/SecondaryBtn.svelte';
	import PrimaryBtn from '$cmpns/PrimaryBtn.svelte';
	import ErrorPage from '$cmpns/ErrorPage.svelte';
	import CommentArea from '$cmpns/CommentArea.svelte';

	export let data;

	let posts = [];
	let observer = null;

	$: fetchDataText = $getPostMutation.isPending ? '加载中...' : '已经到底了';
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
		$getPostMutation.mutate();
	};

	// 打开图片预览
	const openImageViewer = (url) => {
		if (imageViewer == null) return;

		imageViewer.openDialog(url);
	};

	// 路由切换时重新请求帖子数据
	afterNavigate(() => {
		// 跳转到帖子页面时不进行请求
		const type = window.location.href.split('/').at(-2);
		if (type != 'board') return;

		const boardUrl = window.location.href.split('/').at(-1);
		if (boardUrl == 'null') {
			return;
		}
		boardStore.update((b) => {
			return { ...b, from: 0, boardUrl };
		});

		window.localStorage.setItem('board', JSON.stringify($boardStore));

		// 如果重新请求则将post重置为0
		if ($boardStore.from == 0) {
			posts = [];
			$getPostMutation.mutate();
		}
	});

	onMount(() => {
		// 增加observer使其能够在滚动到页面底部时触发新的请求
		let observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if ($boardStore.from > $boardStore.total) {
						return;
					}
					// 避免在页面加载时同时发起
					if ($getPostMutation.isSuccess) {
						$getPostMutation.mutate();
					}
				}
			});
		}, {});

		const getMore = document.querySelector('#getMore');
		if (getMore == undefined) return;

		observer.observe(getMore);
	});

	onDestroy(() => {});
</script>

<div class="px-2 md:px-0 container grow mx-auto">
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
			class="rounded-t-md bg-slate-100 dark:bg-sky-700
			px-4 py-2 mt-2 shadow-inner"
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
