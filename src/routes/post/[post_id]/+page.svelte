<script>
	export let data;
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';

	import { createMutation } from '@tanstack/svelte-query';

	import BackIcon from '$svgIcon/back.svelte';

	import { boardStore } from '../../../store/boardStore';
	import { userStore } from '../../../store/userStore';

	import { reduceContent } from '$lib/PostManage/utils';

	import SendForm from '$cmpns/SendForm.svelte';
	import PostContent from '$cmpns/PostContent.svelte';
	import ImageViewer from '$cmpns/ImageViewer.svelte';
	import SecondaryBtn from '$cmpns/SecondaryBtn.svelte';
	import PrimaryBtn from '$cmpns/PrimaryBtn.svelte';
	import SuperOperationBtn from '$cmpns/SuperOperationBtn.svelte';
	import RemoveConfirmDialog from '$cmpns/PostManage/RemoveConfirmDialog.svelte';
	import PostStatusBadge from '$cmpns/PostStatusBadge.svelte';

	let imageViewer = null;
	let newCommentForm = null;

	let comments = [];

	// 打开图片预览
	const openImageViewer = (url) => {
		if (imageViewer == null) return;

		imageViewer.openDialog(url);
	};

	// 打开评论框
	const openCommentForm = (fromCommentId) => {
		if (newCommentForm == null) return;
		if (fromCommentId != undefined) {
			const reply = `> 回复 [此串](#id-${fromCommentId})`;
			newCommentForm.showForm({ type: 'comment', replyId: fromCommentId, reply });
			return;
		}

		const post_id = window.location.href.split('/').at(-1);
		newCommentForm.showForm({ type: 'comment', replyId: post_id});
	};

	// 打开编辑对话框
	const openEditForm = (content, postId) => {
		if (newCommentForm == null) return;
		newCommentForm.showForm({ type: 'edit', content, postId });
	};

	//
	$: fetchDataText = $getCommentMutation.isPending
		? '加载中...'
		: $boardStore.comment_from > $boardStore.comment_total
			? '没有更多了'
			: '已经到底了';

	const getCommentMutation = createMutation({
		mutationFn: async () => {
			const post_id = window.location.href.split('/').at(-1);
			const res = await fetch(`/comment/${post_id}?from=${$boardStore.comment_from}`).then((r) =>
				r.json()
			);

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
					comment_from: old.comment_from + res.getSize,
					comment_total: res.totalComment
				};
			});

			window.localStorage.setItem('board', JSON.stringify($boardStore));
		}
	});

	// 处理发送评论
	const handleSendComment = async (e) => {
		const commentId = e.detail.id;
		// 如果已经在最后一页，则只需增加那一串内容即可，无需再请求整个
		if ($boardStore.comment_from > $boardStore.comment_total) {
			const newComment = await $getSingleCommentMutation.mutateAsync(commentId);
			let { id, poster_name, poster_email, title, comment_time, content, cookies_content } =
				newComment;

			comments.push({
				id,
				poster_name,
				poster_email,
				title,
				content,
				comment_time,
				cookies_content
			});

			comments = comments;
		}
	};

	// 获取单条评论的mutation
	const getSingleCommentMutation = createMutation({
		mutationFn: async (commentId) => {
			const res = await fetch(`/comment/single/${commentId}`).then((r) => r.json());

			if (res.type != 'ok') return [];

			return res.comment;
		}
	});

	// 获取单条串的mutation
	const getSinglePostMutation = createMutation({
		mutationFn: async (postId) => {
			const res = await fetch(`/post/single/${postId}`).then((r) => r.json());

			if (res.type != 'ok') return null;
			return res.post;
		}
	});

	// 处理更新串或评论
	const handleUpdatePostOrComment = async (e) => {
		// 参数形如post_xxxxx或则comment_xxxx
		const [type, id] = e.detail.split('_');

		if (id == undefined) return;

		// 串处理
		if (type == 'post') {
			const updatedPost = await $getSinglePostMutation.mutateAsync(id);

			if (updatedPost == null) return;
			data.post = updatedPost;
			return;
		}

		// 评论处理
		const updatedComment = await $getSingleCommentMutation.mutateAsync(id);

		if (updatedComment == []) return;

		const filtered = comments.filter((c) => c.id == updatedComment.id);

		if (filtered.length != 1) return;

		let { poster_name, poster_email, title, content, edit_time } = updatedComment;

		filtered[0].content = content;
		filtered[0].edit_time = edit_time;
		filtered[0].poster_email = poster_email;
		filtered[0].poster_name = poster_name;
		filtered[0].title = title;

		comments = comments;
	};

	// 是否PostAuthor
	$: isPostAuthor = (c) => {
		if (data.post.cookies_content == undefined || data.post.cookies_content == '神秘饼干')
			return false;
		return c == data.post.cookies_content;
	};

	let postId = null;

	let removeConfirmDialog = null;

	// 打开删除评论对话框
	const openRemoveConfirmDialog = (id) => {
		if (removeConfirmDialog == null) return;

		removeConfirmDialog.openDialog(id);
	};

	// 删除某条评论
	const removeComment = ({ id }) => {
		comments = comments.filter((one) => one.id != id);
	};

	// 当前用户可否编辑串或回复
	const isUserEditable = (cookies, postStatus) => {
		const usingCookie = $userStore.usingCookie;
		if (usingCookie == cookies && postStatus == 'repliable') return true;
		return false;
	};

	afterNavigate(() => {
		// 跳转到非串页面时不进行请求
		const type = window.location.href.split('/').at(-2);
		if (type != 'post') {
			return;
		}

		// 修复帖子页面刷新后会将boardUrl重置为null的问题
		let boardUrlLocalStorage = null;
		const boardStr = window.localStorage.getItem('board');
		if (boardStr != undefined) {
			const board = JSON.parse(boardStr);
			boardUrlLocalStorage = board.boardUrl;
		}

		boardStore.update((b) => {
			return {
				...b,
				boardUrl: boardUrlLocalStorage,
				comment_from: 0,
				comment_total: 0
			};
		});

		window.localStorage.setItem('board', JSON.stringify($boardStore));

		// 如果重新请求则将post重置为0
		if ($boardStore.comment_from == 0) {
			comments = [];
			$getCommentMutation.mutate();
		}
	});

	onMount(() => {
		// 增加observer使其能够在滚动到页面底部时触发新的请求
		let observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if ($boardStore.comment_from > $boardStore.comment_total) {
						return;
					}
					// 避免在页面加载时同时发起
					if ($getCommentMutation.isSuccess) {
						$getCommentMutation.mutate();
					}
				}
			});
		}, {});

		const getMore = document.querySelector('#getMore');
		if (getMore == undefined) return;

		observer.observe(getMore);
	});
</script>

<div class="px-2 md:px-0 grow container m-auto">
	<div class="mt-4">
		<a href={`/board/${$boardStore.boardUrl}`}>
			<PrimaryBtn>
				<BackIcon />
				<span>返回版块</span>
			</PrimaryBtn>
		</a>
	</div>
	<div
		class="rounded-md bg-slate-100 dark:bg-sky-700 px-4 py-2 mt-2 shadow-inner"
		id="id-{data.post.id}"
	>
		<div class="flex justify-between items-end">
			<p class="space-x-2">
				<span class="dark:text-green-100 font-bold">标题：{data.post.title}</span>
				<span class="dark:text-yellow-100">作者：{data.post.author}</span>
				<span class="dark:text-red-100 italic">邮箱：{data.post.email}</span>
				<span>写于：{data.post.post_time}</span>
				<span class="dark:text-indigo-100">饼干：{data.post.cookies_content}</span>
				{#if data.post.edit_time != null}
					<span
						class="
					bg-red-100
					dark:text-fuchsia-100 dark:bg-violet-700/20
					rounded-md px-2 py-1">编辑于：{data.post.edit_time}</span
					>
				{/if}
			</p>
			<p>
				{#if $userStore.type == 'admin' || isUserEditable(data.post.cookies_content, data.post.status)}
					<SuperOperationBtn
						on:click={() => openEditForm(data.post.content, `post_${data.post.id}`)}
						>编辑</SuperOperationBtn
					>
				{/if}

				{#if data.post.status == 'repliable' && $userStore.type == 'user'}
					<SecondaryBtn on:click={() => openCommentForm()}>回复</SecondaryBtn>
				{:else if data.post.status == 'readonly' && $userStore.type == 'user'}
					<PostStatusBadge>此串不允许回复</PostStatusBadge>
				{/if}
			</p>
		</div>
		<div class="border border-cyan-600 mt-2 py-2 px-4 rounded-sm">
			<PostContent content={data.post.content} on:largeImage={(e) => openImageViewer(e.detail)} />
		</div>
	</div>
	{#each comments as comment}
		<div
			class="rounded-md odd:bg-slate-200/60 even:bg-slate-200
			dark:odd:bg-sky-800 dark:even:bg-sky-800/50 px-4 py-2 mt-2 shadow-inner"
			id="id-{comment.id}"
		>
			<div class="flex justify-between items-end">
				<p class="space-x-2">
					<span class="dark:text-green-100 font-bold">标题：{comment.title}</span>
					<span class="dark:text-yellow-100">作者：{comment.poster_name}</span>
					<span class="dark:text-red-100 italic">邮箱：{comment.poster_email}</span>
					<span>写于：{comment.comment_time}</span>
					<span class="dark:text-indigo-100">饼干：{comment.cookies_content} </span>
					{#if isPostAuthor(comment.cookies_content)}
						<span
							class="shadow-inner shadow-sky-200 dark:shadow-slate-500 bg-sky-100 dark:bg-slate-400 px-2 py-1 rounded-md"
						>
							Po
						</span>
					{/if}
					{#if comment.edit_time != null}
						<span
							class="
						bg-red-100
						dark:text-fuchsia-100 dark:bg-violet-700/20
						rounded-md px-2 py-1">编辑于：{comment.edit_time}</span
						>
					{/if}
				</p>
				<p>
					{#if $userStore.type == 'admin'}
						<SuperOperationBtn
							type="delete"
							on:click={() =>
								openRemoveConfirmDialog({
									id: comment.id,
									content: reduceContent(comment.content)
								})}>删除</SuperOperationBtn
						>
					{/if}
					{#if $userStore.type == 'admin' || isUserEditable(comment.cookies_content, data.post.status)}
						<SuperOperationBtn
							on:click={() => openEditForm(comment.content, `comment_${comment.id}`)}
							>编辑</SuperOperationBtn
						>
					{/if}
					{#if data.post.status == 'repliable' && $userStore.type == 'user'}
						<SecondaryBtn on:click={() => openCommentForm(comment.id)}>回复</SecondaryBtn>
					{:else if data.post.status == 'readonly'}
						<PostStatusBadge>此串不允许回复</PostStatusBadge>
					{/if}
				</p>
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
<SendForm
	bind:this={newCommentForm}
	on:sendComment={handleSendComment}
	on:edit={handleUpdatePostOrComment}
/>
<ImageViewer bind:this={imageViewer} />
<RemoveConfirmDialog bind:this={removeConfirmDialog} on:delete={(e) => removeComment(e.detail)} />
