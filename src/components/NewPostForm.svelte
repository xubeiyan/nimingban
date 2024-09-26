<script>
	import MarkdownIcon from '$svgIcon/markdown.svelte';
	import AddPlusIcon from '$svgIcon/addPlus.svelte';
	import CloseIcon from '$svgIcon/close.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';

	import MarkdownContent from './NewPostForm/MarkdownContent.svelte';
	import AttachPicture from './NewPostForm/AttachPicture.svelte';

	let show = false;
	$: showStyle = show ? 'top-0' : 'top-[100%]';

	// 发送帖子内容
	let post = {
		name: null,
		email: null,
		title: null,
		content: null
	};

	let attachFile = null;

	let attachedFileList = [];

	const openAttachSelect = () => {
		if (attachFile == null) return;
		attachFile.click();
	};

	const addImageFiles = (e) => {
		const files = e.target.files;

		for (let file of files) {
			attachedFileList.push({
				id: attachedFileList.length + 1,
				name: file.name,
				fileContent: file
			});
		}

		attachFile.value = '';

		// reactivity
		attachedFileList = attachedFileList;
	};

	const handleImageRemove = (e) => {
		const id = e.detail.id;
		attachedFileList = attachedFileList.filter((one) => one.id != id);
	};

	const handleInsertImageToPost = (e) => {
		const id = e.detail.id;
		const imageMarkdown = `![](/images/${id} "附加图片${id}")\n`;
		if (post.content == null) {
			post.content = imageMarkdown;
		} else {
			post.content += imageMarkdown;
		}
	}

	// 发送按钮状态
	let sendBtnStatus = 'idle';
	$: sendBtnText =
		sendBtnStatus == 'idle'
			? '发送'
			: sendBtnStatus == 'sending'
				? '发送中...'
				: sendBtnStatus == 'failed'
					? '发串失败，重试'
					: '发串完成';
	$: sendBtnClass = ['idle', 'failed'].includes(sendBtnStatus)
		? 'bg-slate-300/50 dark:bg-slate-50/20 dark:bg-slate-50/10 hover:dark:bg-slate-50/20 hover:shadow-md'
		: '';
	// 发送串
	const sendPost = async () => {
		const form = new FormData();
		attachedFileList.forEach((file) => {
			form.append('image', file.fileContent);
		});

		form.append('name', post.name);
		form.append('email', post.email);
		form.append('title', post.title);
		form.append('content', post.content);

		sendBtnStatus = 'sending';
		const res = await fetch('/board/sendPost', {
			method: 'POST',
			body: form
		});

		// 处理发串失败的情况
		if (res.status != 200) {
			sendBtnStatus = 'failed';
			return;
		}
		const json = await res.json();
		sendBtnStatus = 'ok';

		// 清空发帖部分
		show = false;
		sendBtnStatus = 'idle';
		post = {
			name: null,
			email: null,
			title: null,
			content: null
		};
		attachFile.value = '';
		attachedFileList = [];
	};

	let expand = false;

	// 展开编辑区
	const toggleEdit = () => {
		expand = !expand;
	};

	export const showForm = () => {
		show = true;
	};

	$: formWidthClass = expand ? 'md:w-[95%]' : 'md:w-[50em]';
	$: markdownBtnClass = expand ? 'bg-blue-400' : 'bg-blue-200';

	let inputStyle =
		'outline-none border border-slate-300 focus-within:border-slate-600 focus-within:dark:border-slate-400 dark:border-slate-600 focus-within:dark:bg-slate-600 dark:bg-slate-700 rounded-md';
</script>

<div
	class="z-20 fixed {showStyle} transition-all duration-500 w-screen h-screen max-h-screen overflow-y-auto bg-gray-300/50 dark:bg-gray-100/30"
>
	<form
		class="relative {formWidthClass} w-[90%] transition-all duration-500 mx-auto my-[5em] bg-sky-100 dark:bg-sky-800 py-4 px-6 rounded-md"
	>
		<h1 class="text-2xl mb-6">发新串</h1>
		<div class="flex gap-2 mb-2">
			<label class="grow flex flex-col gap-1">
				<span>名称</span>
				<input class="{inputStyle} px-2 py-0.5" placeholder="无名氏" bind:value={post.name} />
			</label>
			<label class="grow flex flex-col gap-1">
				<span>E-mail</span>
				<input
					class="{inputStyle} px-2 py-0.5"
					placeholder="no@name.net"
					bind:value={post.email}
				/>
			</label>
			<label class="grow flex flex-col gap-1">
				<span>标题</span>
				<input class="{inputStyle} px-2 py-0.5" placeholder="无标题" bind:value={post.title} />
			</label>
		</div>
		<div class="relative flex gap-2">
			<label class="grow flex flex-col gap-1 mt-3">
				<span>正文</span>
				<textarea class="{inputStyle} px-2 py-1 grow" rows="10" bind:value={post.content}
				></textarea>
			</label>
			<button
				class="absolute right-0 top-0 {markdownBtnClass} px-2 rounded-md hover:shadow-md"
				on:click={toggleEdit}
			>
				<MarkdownIcon highlight={expand} />
			</button>

			{#if expand}
				<MarkdownContent content={post.content} />
			{/if}
		</div>
		<div class="mt-2 flex flex-col">
			<label class="mb-1">
				<span>附加图片</span>
				<input
					type="file"
					class="hidden"
					bind:this={attachFile}
					multiple
					accept=".jpeg, .jpg, .png, .webp"
					on:change={(e) => addImageFiles(e)}
				/>
			</label>
			<div class="flex gap-2">
				{#each attachedFileList as attachFile}
					<AttachPicture
						{attachFile}
						on:removeImage={handleImageRemove}
						on:insertImageToPost={handleInsertImageToPost}
					/>
				{/each}
				<button
					class="border-2 border-slate-500 dark:border-slate-100 border-dashed hover:bg-slate-500/10 hover:dark:bg-slate-50/10 rounded-lg size-16 flex justify-center items-center"
					on:click={openAttachSelect}
				>
					<AddPlusIcon />
				</button>
			</div>
		</div>
		<div class="mt-6 flex justify-end">
			<button
				type="submit"
				class="{sendBtnClass} px-3 py-1 rounded-md flex gap-1 items-center"
				disabled={['sending', 'ok'].includes(sendBtnStatus)}
				on:click={sendPost}
			>
				{#if sendBtnStatus == 'sending'}
					<LoadingIcon />
				{/if}
				<span>{sendBtnText}</span></button
			>
		</div>
		<button
			class="absolute right-4 top-4 size-8 rounded-md flex justify-center items-center"
			on:click={() => (show = false)}
		>
			<CloseIcon />
		</button>
	</form>
</div>
