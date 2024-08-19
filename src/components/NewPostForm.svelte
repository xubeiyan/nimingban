<script>
	import AddPlusIcon from '../assets/svg-icons/addPlus.svelte';
	import CloseIcon from '../assets/svg-icons/close.svelte';
	import TrashIcon from '../assets/svg-icons/trash.svelte';

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
				name: file.name,
				fileContent: file
			});
		}

		// reactivity
		attachedFileList = attachedFileList;
	};

	const removeImageFile = (name) => {
		attachedFileList = attachedFileList.filter((one) => one.name != name);
	};

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

		const res = await fetch('/board/sendPost', {
			method: 'POST',
			body: form
		});
	};

	export const showForm = () => {
		show = true;
	};

	let inputStyle =
		'outline-none border border-slate-300 focus-within:border-slate-600 focus-within:dark:border-slate-400 dark:border-slate-600 focus-within:dark:bg-slate-600 dark:bg-slate-700 rounded-md';
</script>

<div class="z-20 fixed {showStyle} transition-all duration-500 w-screen bg-gray-100/30">
	<form
		class="relative w-[90%] md:w-[50em] mx-auto my-[5em] bg-sky-100 dark:bg-sky-800 py-4 px-6 rounded-md"
	>
		<h1 class="text-2xl mb-6">发新串</h1>
		<div class="flex gap-2 mb-2">
			<label class="flex flex-col gap-1">
				<span>名称</span>
				<input class="{inputStyle} px-2 py-0.5" placeholder="无名氏" bind:value={post.name} />
			</label>
			<label class="flex flex-col gap-1">
				<span>E-mail</span>
				<input class="{inputStyle} px-2 py-0.5" placeholder="" bind:value={post.email} />
			</label>
			<label class="flex flex-col gap-1 grow">
				<span>标题</span>
				<input class="{inputStyle} px-2 py-0.5" placeholder="无标题" bind:value={post.title} />
			</label>
		</div>
		<div>
			<label class="flex flex-col gap-1">
				<span>正文</span>
				<textarea class="{inputStyle} px-2 py-1" rows="10" bind:value={post.content} required
				></textarea>
			</label>
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
					<div class="relative">
						<img
							class="size-16 object-cover object-center rounded-md"
							src={window.URL.createObjectURL(attachFile.fileContent)}
							alt="to upload"
						/>
						<button
							class="absolute inset-0 flex justify-center items-center bg-slate-100/50 dark:bg-slate-600/50 opacity-0 hover:opacity-100"
							on:click={() => removeImageFile(attachFile.name)}
						>
							<TrashIcon />
						</button>
					</div>
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
				class="bg-slate-300/50 hover:bg-slate-300/70 dark:bg-slate-50/20 hover:dark:bg-slate-50/30 px-3 py-1 rounded-md"
				on:click={sendPost}>发送</button
			>
		</div>
		<button
			class="absolute right-4 top-4 dark:bg-slate-50/10 hover:dark:bg-slate-50/20 size-8 rounded-md flex justify-center items-center"
			on:click={() => (show = false)}
		>
			<CloseIcon />
		</button>
	</form>
</div>
