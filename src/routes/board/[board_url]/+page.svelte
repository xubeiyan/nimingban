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
	import SuperOperationBtn from '$cmpns/SuperOperationBtn.svelte';
	import PostStatusDialog from '$cmpns/PostManage/PostStatusDialog.svelte';
	import PostStatusBar from '$cmpns/PostManage/PostStatusBar.svelte';
	import MoveToDialog from '$cmpns/PostManage/MoveToDialog.svelte';

	import { reduceContent } from '$lib/PostManage/utils';
	import DeleteConfimDialog from '$cmpns/PostManage/DeleteConfimDialog.svelte';
	import CookieBtn from '$cmpns/CookiesManage/CookieBtn.svelte';
	import TertiaryBtn from '$cmpns/TertiaryBtn.svelte';
	import PostStatusBadge from '$cmpns/PostStatusBadge.svelte';

	export let data;

	let posts = [];
	let observer = null;

	$: fetchDataText = $getPostMutation.isPending
		? '加载中...'
		: $boardStore.from > $boardStore.total
			? '没有更多了'
			: '已经到底了';
	const getPostMutation = createMutation({
		mutationFn: async () => {
			let headers = {};
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			const res = await fetch(`/board/getPosts/${$boardStore.boardUrl}?from=${$boardStore.from}`, {
				headers
			}).then((r) => r.json());

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
		}
	});

	let newPostForm = null;
	let imageViewer = null;

	const showNewPostForm = () => {
		if (newPostForm == null) return;
		newPostForm.showForm({ type: 'post' });
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

	let postStatusDialog = null;
	// 打开修改串可见性对话框
	const openModifyPostDialog = (id, status, content) => {
		if (postStatusDialog == null) return;

		postStatusDialog.openDialog({ id, status, content: reduceContent(content) });
	};

	const handleStatusUpdate = ({ id, status }) => {
		const filtered = posts.filter((p) => p.id == id);
		if (filtered.length != 1) return;
		filtered[0].status = status;
		posts = posts;
	};

	let deleteConfirmDialog = null;
	// 打开删除对话框
	const openDeleteDialog = (id, content) => {
		if (deleteConfirmDialog == null) return;
		deleteConfirmDialog.openDialog({ id, content: reduceContent(content) });
	};

	const handlePostDelete = ({ id }) => {
		posts = posts.filter((p) => p.id != id);
	};

	let moveToDialog = null;
	// 打开移动对话框
	const openMoveToDialog = ({ id, content }) => {
		if (moveToDialog == null) return;
		moveToDialog.openDialog({ id, content: reduceContent(content) });
	};

	// 移动此串（即在当前页面移除
	const handleMovePost = ({ id }) => {
		posts = posts.filter((p) => p.id != id);
	};

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
</script>

<div class="px-2 md:px-0 container grow mx-auto">
	{#if data.type == 'error'}
		<ErrorPage message="访问的地址不存在" />
	{:else}
		<h1 class="text-3xl py-4">
			{data.name}
		</h1>
		<p
			class="bg-slate-200 dark:bg-sky-800 rounded-md px-6 py-4 shadow-inner shadow-slate-300 dark:shadow-sky-950 mb-4"
		>
			<PostContent content={data.intro} />
		</p>
		{#if $userStore.type == 'user'}
			<p class="pb-4">
				<PrimaryBtn on:click={showNewPostForm}>发新串</PrimaryBtn>
			</p>
		{/if}
	{/if}
	{#each posts as post}
		<div
			class="rounded-md bg-slate-100 dark:bg-sky-700
			pt-2 mb-4 shadow-inner
			shadow-slate-200 dark:shadow-sky-800"
			id="id-{post.id}"
		>
			<div class="flex justify-between items-end mx-4">
				<p class="space-x-2">
					<a href="#id-{post.id}">
						<span class="dark:text-green-100 font-bold">标题：{post.title}</span>
					</a>
					<span class="dark:text-yellow-100">作者：{post.author}</span>
					<span class="dark:text-red-100 italic">邮箱：{post.email}</span>
					<span>写于：{post.post_time}</span>
					<CookieBtn content={post.cookies_content} />
					{#if post.edit_time != null}
						<span
							class="
						bg-red-100
						dark:text-fuchsia-100 dark:bg-violet-700/20
						rounded-md px-2 py-1">编辑于：{post.edit_time}</span
						>
					{/if}
				</p>
				<div class="flex gap-2 items-center">
					{#if $userStore.type == 'admin'}
						<PostStatusBar
							status={post.status}
							on:openDeleteDialog={() => openDeleteDialog(post.id, post.content)}
							on:click={() => openModifyPostDialog(post.id, post.status, post.content)}
						/>
						<TertiaryBtn on:click={() => openMoveToDialog({ id: post.id, content: post.content })}
							>移动到...</TertiaryBtn
						>
					{/if}
					{#if post.status == 'readonly' && $userStore.type == 'user'}
						<PostStatusBadge>此串不允许回复</PostStatusBadge>
					{/if}
					<a href="/post/{post.id}">
						<SecondaryBtn>详情</SecondaryBtn>
					</a>
				</div>
			</div>
			<div class="border border-cyan-600 mx-4 my-2 py-2 px-4 rounded-sm">
				<PostContent content={post.content} on:largeImage={(e) => openImageViewer(e.detail)} />
			</div>
			<CommentArea postId={post.id} on:largeImage={(e) => openImageViewer(e.detail)} />
		</div>
	{/each}
	{#if data.name}
		<div class="rounded-md bg-sky-200 dark:bg-sky-400/50 p-4 my-2" id="getMore">
			<span>{fetchDataText}</span>
		</div>
	{/if}
</div>

<SendForm bind:this={newPostForm} on:sendPost={handleSendPost} />
<ImageViewer bind:this={imageViewer} />
<PostStatusDialog bind:this={postStatusDialog} on:update={(e) => handleStatusUpdate(e.detail)} />
<DeleteConfimDialog
	bind:this={deleteConfirmDialog}
	on:deletePost={(e) => handlePostDelete(e.detail)}
/>
<MoveToDialog bind:this={moveToDialog} on:move={(e) => handleMovePost(e.detail)} />
