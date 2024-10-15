<script>
	export let data;
	import PostContent from '../../../components/PostContent.svelte';

	import { boardStore } from '../../../store/boardStore';

	const goBack = () => {
		window.location.href = `/board/${$boardStore.boardUrl}`;
	};
</script>

<div class="container m-auto">
	<div class="mt-4">
		<button on:click={goBack}> 返回 </button>
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
		</div>
		<div class="border border-cyan-600 mt-2 py-2 px-4 rounded-sm">
			<PostContent content={data.post.content} />
		</div>
	</div>
</div>
