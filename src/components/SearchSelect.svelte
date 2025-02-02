<script>
	import TrashIcon from '$svgIcon/trash.svelte';
	import LoadingIcon from '$svgIcon/loading.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let placeholder = '输入文字';
	export let isPending = true;
	export let options = [];

	let inputValue = '';

	$: filteredOptions = options.filter((one) => one.label.includes(inputValue));

	let inputOption = null;
	$: optionStyle = inputOption == null ? '' : 'hidden';
	// 填入值
	const fillValue = (obj) => {
		inputOption = obj;
		dispatch('select', { id: obj.value });
	};
	// 清空值
	const clearFilledValue = () => {
		inputOption = null;
		inputValue = '';
		dispatch('select', { id: null });
	};
</script>

<div class="relative">
	<div class="rounded-md shadow-inner focus-within:shadow-slate-300 bg-slate-100 dark:bg-sky-950 px-2 py-0.5 w-full flex justify-between">
		{#if isPending}
			<div class="flex items-center gap-1">
				<LoadingIcon />
				<span>获取中...</span>
			</div>
		{:else if inputOption != null}
			<span class="rounded-md">{inputOption.label}</span>
			<button on:click={clearFilledValue}><TrashIcon size="1.5em" /></button>
		{:else}
			<input {placeholder} bind:value={inputValue} class="bg-transparent w-full outline-none" />
		{/if}
	</div>
	<div
		class="absolute rounded-md flex flex-col overflow-clip
  shadow-sm shadow-slate-500 dark:shadow-slate-700 bg-white
  divide-y divide-sky-300 dark:divide-cyan-200 {optionStyle}"
	>
		{#each filteredOptions as o}
			<button class="px-2 py-1 bg-sky-200/80 hover:bg-sky-200 dark:bg-sky-800 hover:dark:bg-sky-800/90" on:click={() => fillValue(o)}
				>{o.label}</button
			>
		{/each}
	</div>
</div>
