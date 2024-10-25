<script>
	import MarkdownIcon from '$svgIcon/markdown.svelte';
	import AddPlusIcon from '$svgIcon/addPlus.svelte';

	import MarkdownContent from './NewPostForm/MarkdownContent.svelte';
	import AttachPicture from './NewPostForm/AttachPicture.svelte';
	import InlineInput from './NewPostForm/InlineInput.svelte';
	import MutilineContent from './NewPostForm/MutilineContent.svelte';
	import CloseBtn from './NewPostForm/CloseBtn.svelte';

	import { userStore } from '../store/userStore';
	import { boardStore } from '../store/boardStore';
	import { createMutation } from '@tanstack/svelte-query';

	import { createEventDispatcher } from 'svelte';
	import SendBtn from './NewPostForm/SendBtn.svelte';
	const dispatch = createEventDispatcher();

	export let type = 'post';
	$: formTitle = type == 'post' ? '发新串' : '回复串';

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
		const imageMarkdown = `![附加图片${id}](/TEMPFOLDER/${id} "附加图片${id}")\n`;
		if (post.content == null) {
			post.content = imageMarkdown;
		} else {
			post.content += imageMarkdown;
		}
	};

	// 发送按钮状态
	let sendBtnStatus = 'idle';

	// 发送结果
	let sendResponseError = null;
	// 发送串
	const sendPost = async () => {
		const res = await $sendPostMutation.mutateAsync();

		// 处理返回的错误
		if (res.type == 'error') {
			const verb = type == 'post' ? '发串' : '回复串';
			if (res.errorCode == 'BEYOND_MAX_UPLAD_IMAGE_COUNT') {
				sendResponseError = {
					text: '上传图片数超出了限制'
				};
			} else if (res.errorCode == 'IMAGE_FORMAT_NOT_ALLOW') {
				sendResponseError = {
					text: `图片 ${json.errorDetail.filenames.join(', ')} 不是允许上传的格式`
				};
			} else if (res.errorCode == 'IMAGE_OVERSIZE') {
				sendResponseError = {
					text: `图片 ${res.errorDetail.filenames.join(', ')} 超出了大小限制`
				};
			} else if (res.errorCode == 'CONTENT_LENGTH_TOO_SHORT') {
				sendResponseError = {
					text: `串的正文内容太短了`
				};
			} else if (res.errorCode == 'NO_AUTHORIZATION_HEADER') {
				sendResponseError = {
					text: `${verb}需要登录且拥有饼干`
				};
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				sendResponseError = {
					text: `认证字段不正确`
				};
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				sendResponseError = {
					text: `需要退出后重新登录`
				};
			} else if (res.errorCode == 'WRONG_COOKIES') {
				sendResponseError = {
					text: `当前饼干: "${window.localStorage.getItem('usingCookies')}" 无法${verb}`
				};
			} else if (res.errorCode == 'POST_TOO_FAST') {
				sendResponseError = {
					text: `${verb}太快了，请等待 ${res.extra} 秒后重试`
				};
			}

			sendBtnStatus = 'failed';
			return;
		}

		sendBtnStatus = 'ok';

		if (type == 'post') {
			// 发送发帖消息
			dispatch('sendPost');
		} else if (type == 'comment') {
			// 发送回帖消息
			dispatch('sendComment');
		}

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

	const sendPostMutation = createMutation({
		mutationFn: async () => {
			const form = new FormData();
			attachedFileList.forEach((file) => {
				form.append('image', file.fileContent);
			});

			form.append('name', post.name);
			form.append('email', post.email);
			form.append('title', post.title);
			form.append('content', post.content);

			// 有usingCookies则附上
			const usingCookies = window.localStorage.getItem('usingCookies');
			if (usingCookies != undefined) {
				form.append('cookies', usingCookies);
			}

			sendBtnStatus = 'sending';
			sendResponseError = null;

			let headers = {};

			// 有userStore.token字段则附上
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 发串和回复串不同
			let url = `/board/sendPost/${$boardStore.boardUrl}`;
			if (type == 'comment') {
				const urlArray = window.location.href.split('/');
				url = `/board/sendComment/${urlArray.at(-1)}`;
			}

			const res = await fetch(url, {
				method: 'POST',
				body: form,
				headers
			});

			// 处理发串API未正常返回的情况
			// TODO: 应该全局地处理这个问题，但使用的是fetch，不会处理
			if (res.status != 200) {
				return JSON.stringify({
					type: 'error',
					errorCode: 'SERVER_NOT_RESPOND_PROPERLY'
				});
			}

			return await res.json();
		}
	});

	let expand = false;

	// 展开编辑区
	const toggleEdit = () => {
		expand = !expand;
	};

	export const showForm = (params) => {
		const { content } = params;
		if (content != undefined) {
			post.content = content;
		}
		show = true;
	};

	$: formWidthClass = expand ? 'md:w-[95%]' : 'md:w-[50em]';
	$: markdownBtnClass = expand ? 'bg-blue-400' : 'bg-blue-200';

	// 将输入的内容调整到各个值中
	const handleInput = (type, value) => {
		if (type == 'name') {
			post.name = value;
		} else if (type == 'email') {
			post.email = value;
		} else if (type == 'title') {
			post.title = value;
		} else if (type == 'content') {
			post.content = value;
		}
	};
</script>

<div
	class="z-20 fixed {showStyle} transition-all duration-500 w-screen h-screen max-h-screen overflow-y-auto bg-gray-300/50 dark:bg-gray-100/30"
>
	<form
		class="relative {formWidthClass} w-[90%] transition-all duration-500 mx-auto my-[5em] bg-sky-100 dark:bg-sky-800 py-4 px-6 rounded-md"
	>
		<h1 class="text-2xl mb-6">{formTitle}</h1>
		<div class="flex gap-2 mb-2">
			<InlineInput
				label="名称"
				placeholder="无名氏"
				on:input={(e) => handleInput('name', e.target.value)}
			/>
			<InlineInput
				label="Email"
				placeholder="no@name.net"
				on:input={(e) => handleInput('email', e.target.value)}
			/>
			<InlineInput
				label="标题"
				placeholder="无标题"
				on:input={(e) => handleInput('title', e.target.value)}
			/>
		</div>
		<div class="relative flex gap-2">
			<MutilineContent
				label="正文"
				value={post.content}
				on:input={(e) => handleInput('content', e.target.value)}
			/>
			<button
				class="absolute right-0 top-0 {markdownBtnClass} px-2 rounded-md hover:shadow-md"
				on:click={toggleEdit}
			>
				<MarkdownIcon highlight={expand} />
			</button>

			{#if expand}
				<div class="w-[50%] mt-10">
					<MarkdownContent content={post.content} />
				</div>
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
					accept=".jpeg, .jpg, .png, .webp, .avif"
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
		<div class="mt-6 flex justify-end items-center gap-4">
			{#if sendResponseError != null}
				<span class="border border-red-400 text-red-600 dark:text-red-300 rounded-md px-2"
					>{sendResponseError.text}</span
				>
			{/if}
			<SendBtn status={sendBtnStatus} {type} on:click={sendPost} />
		</div>
		<CloseBtn
			on:click={() => {
				show = false;
			}}
		/>
	</form>
</div>
