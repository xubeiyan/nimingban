<script>
	export let data;
	import SendForm from '../../../components/SendForm.svelte';
	import PostContent from '../../../components/PostContent.svelte';
	import ImageViewer from '../../../components/ImageViewer.svelte';
	import BackIcon from '$svgIcon/back.svelte';

	import { boardStore } from '../../../store/boardStore';
	import SecondaryBtn from '../../../components/SecondaryBtn.svelte';
	import PrimaryBtn from '../../../components/PrimaryBtn.svelte';

	let imageViewer = null;
	let newCommentForm = null;

	// 打开图片预览
	const openImageViewer = (url) => {
		if (imageViewer == null) return;

		imageViewer.openDialog(url);
	};

	// 打开评论框
	const openCommentForm = () => {
		if (newCommentForm == null) return;
		newCommentForm.showForm();
	};

	// 发送评论
	const handleSendComment = () => {};
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
				<span class="italic">邮箱：{data.post.email}</span>
				<span>写于：{data.post.post_time}</span>
				{#if data.post.edit_time != null}
					<span>编辑于：{data.post.edit_time}</span>
				{/if}
				<span>饼干: {data.post.cookies_content}</span>
			</p>
			<SecondaryBtn on:click={openCommentForm}>回复</SecondaryBtn>
		</div>
		<div class="border border-cyan-600 mt-2 py-2 px-4 rounded-sm">
			<PostContent content={data.post.content} on:largeImage={(e) => openImageViewer(e.detail)} />
		</div>
	</div>
</div>
<SendForm bind:this={newCommentForm} formTitle="回复串" on:sendPost={handleSendComment} />
<ImageViewer bind:this={imageViewer} />
