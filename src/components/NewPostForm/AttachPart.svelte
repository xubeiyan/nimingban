<script>
	import AddPlusIcon from '$svgIcon/addPlus.svelte';
  import AttachPicture from './AttachPicture.svelte';
  import ImmutableFileList from './ImmutableFileList.svelte';

  import { boardStore } from '$store/boardStore';
  import { userStore } from '$store/userStore';

  import { createEventDispatcher } from 'svelte';
  const dispath = createEventDispatcher();

  export let type = 'edit';
  export let postID = "";

  let attachFile = null;
  let attachedFileList = [];
  const openAttachSelect = () => {
		if (attachFile == null) return;
		attachFile.click();
	};

  // 选择图片文件，并且上传为临时文件
	const addImageFiles = (e) => {
    dispath('setUploadImageErr', {
      text: null
    });
		const files = e.target.files;

		// TODO：可以从后端获得
		const MAX_NUMBER_UPLOAD_IMAGES = $boardStore.upload_image_max_count;

		// console.log(MAX_NUMBER_UPLOAD_IMAGES)
		// 检查是否超过允许上传数量
		if (files.length + attachedFileList.length > MAX_NUMBER_UPLOAD_IMAGES) {
			dispath('setUploadImageErr', {
				text: `最多允许上传 ${MAX_NUMBER_UPLOAD_IMAGES} 张图片`
			});
			return;
		}

		// 检查图片大小
		const MAX_IMAGE_SIZE = $boardStore.upload_image_max_size;
		// console.log(MAX_IMAGE_SIZE)
		let oversizeList = [];
    let validFiles = [];

		for (let file of files) {
			if (MAX_IMAGE_SIZE < file.size) {
				oversizeList.push(file.name);
        continue
			}

      const id = attachedFileList.length + 1;

      attachedFileList.push({
				id,
				name: file.name,
        path: '',
        status: 'uploading',
			});
      validFiles.push({
        id,
        file,
      });
    }

    validFiles.forEach(async one => {
      // 未超过的需调用接口上传
      const formData = new FormData();
      formData.append('file', one.file);

      let headers = {};
			// 有userStore.token字段则附上
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

      const res = await fetch('/board/uploadImage', {
        method: 'POST',
        body: formData,
        headers,
      }).then((r) => r.json())

      if (res.type != 'ok') {
        console.log(`上传文件失败，错误码为: ${res.ErrCode}`)
        return
      }
      
      const filtered = attachedFileList.filter(f => f.id == one.id)
      if (filtered.length != 1) {
        return
      }
      filtered[0].path = res.path;
      filtered[0].status = 'uploaded';

      // reactivity
      attachedFileList = attachedFileList;
    });
		attachFile.value = '';

    // 显示超过限制大小的图片名称
		if (oversizeList.length > 0) {
			dispath('setUploadImageErr', {
				text: `图片 ${oversizeList.join(', ')} 的体积超过了 ${$boardStore.upload_image_max_size / 1024} KiB 限制`
			});
		}


		// reactivity
		attachedFileList = attachedFileList;
	};

  // 移除图片
  const handleRemoveImage = (id) => {
    attachedFileList = attachedFileList.filter(f => f.id != id);
  }

</script>
<div class="mt-2 flex flex-col items-start">
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
  {#if type == 'edit'}
    <ImmutableFileList
      postID={postID}
      on:insertImageToPost
    />
  {:else}
    <div class="flex gap-4 mt-2">
      {#each attachedFileList as attachFile}
        <AttachPicture
          {attachFile}
          on:removeImage={e => handleRemoveImage(e.detail.id)}
          on:insertImageToPost
        />
      {/each}
      <button
        class="border-2 border-slate-500 dark:border-slate-100 border-dashed hover:bg-slate-500/10 hover:dark:bg-slate-50/10 rounded-lg size-20 flex justify-center items-center"
        on:click={openAttachSelect}
        type="button"
      >
        <AddPlusIcon />
      </button>
    </div>
  {/if}
</div>


