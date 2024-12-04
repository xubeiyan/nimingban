<script>
	import RightIcon from '$svgIcon/right.svelte';

	export let value = null;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const selectOptions = [
		{
			label: '可回复',
			value: 'repliable'
		},
		{
			label: '仅查看',
			value: 'readonly'
		},
		{
			label: '隐藏',
			value: 'hidden'
		}
	];

	$: labelText = (value) => {
		const filtered = selectOptions.filter((one) => one.value == value);

		if (filtered.length == 1) {
			return filtered[0].label;
		}

		return `未知值 ${value}`;
	};

	let selectOpen = false;

	$: selectListStyle = selectOpen ? '' : 'scale-y-0';

	const selectOne = (value) => {
		dispatch('select', value);
		selectOpen = false;
	};
</script>

<div
	class="relative grow flex px-2 py-1 rounded-md
    bg-slate-100 dark:bg-slate-600
    shadow-inner shadow-slate-300 dark:shadow-slate-700"
>
	<span class="grow">{labelText(value)}</span>
	<button
		on:click={() => {
			selectOpen = !selectOpen;
		}}
	>
		<RightIcon turn={selectOpen ? -90 : 90} />
	</button>
	<div
		class="absolute w-full left-0 top-[100%] z-10 {selectListStyle} transition origin-top rounded-md overflow-hidden
    divide-y divide-sky-300 dark:divide-sky-600
    shadow-sm shadow-indigo-400 dark:shadow-slate-900"
	>
		{#each selectOptions as s}
			<button
				class="block w-full px-2 py-1
                bg-sky-200/70 hover:bg-sky-200 dark:bg-sky-700/70 dark:hover:bg-sky-600"
				on:click={() => selectOne(s.value)}>{s.label}</button
			>
		{/each}
	</div>
</div>
