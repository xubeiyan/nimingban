<script>
	import AddPlusIcon from '../assets/svg-icons/addPlus.svelte';
	import CloseIcon from '../assets/svg-icons/close.svelte';

	let show = false;
	$: showStyle = show ? 'top-0' : 'top-[100%]';

	let attachFile = null;

	const openAttachSelect = () => {
		if (attachFile == null) return;
		attachFile.click();
	};

	const addImageFiles = (e) => {
        console.log(e.target.files);
    };

	export const showForm = () => {
		show = true;
	};

	let inputStyle =
		'outline-none border border-slate-100 focusborder- dark:border-slate-300 focus-within:dark:border-slate-50 focus-within:dark:bg-slate-600 dark:bg-slate-700 rounded-md';
</script>

<div class="z-20 fixed {showStyle} transition-all duration-500 w-screen bg-gray-100/30">
	<form
		class="relative w-[90%] md:w-[50em] mx-auto my-[5em] bg-sky-100 dark:bg-sky-800 py-4 px-6 rounded-md"
	>
		<h1 class="text-2xl mb-6">发新串</h1>
		<div class="flex gap-2 mb-2">
			<label class="flex flex-col gap-1">
				<span>名称</span>
				<input class="{inputStyle} px-2 py-0.5" placeholder="无名氏" />
			</label>
			<label class="flex flex-col gap-1">
				<span>E-mail</span>
				<input class="{inputStyle} px-2 py-0.5" placeholder="" />
			</label>
			<label class="flex flex-col gap-1 grow">
				<span>标题</span>
				<input class="{inputStyle} px-2 py-0.5" placeholder="无标题" />
			</label>
		</div>
		<div>
			<label class="flex flex-col gap-1">
				<span>正文</span>
				<textarea class="{inputStyle} px-2 py-1" rows="10"></textarea>
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
			<button
				class="border-2 dark:border-slate-100 border-dashed hover:dark:bg-slate-50/10 rounded-lg size-16 flex justify-center items-center"
				on:click={openAttachSelect}
			>
				<AddPlusIcon />
			</button>
		</div>
		<div class="mt-6 flex justify-end">
			<button class="bg-slate-50/20 hover:bg-slate-50/30 px-3 py-1 rounded-md">发送</button>
		</div>
		<button
			class="absolute right-4 top-4 dark:bg-slate-50/10 hover:dark:bg-slate-50/20 size-8 rounded-md flex justify-center items-center"
			on:click={() => (show = false)}
		>
			<CloseIcon />
		</button>
	</form>
</div>
