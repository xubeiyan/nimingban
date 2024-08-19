<script>
	import EyeClosedIcon from '$svgIcon/eyeClosed.svelte';
	import EyeIcon from '$svgIcon/eye.svelte';

	export let error = null;
	export let label = '未知label';

	let textInputBorderStyle =
		'border border-zinc-300 dark:border-zinc-600 focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400';
	let textInputBgStyle =
		'bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700';
	// 输入框样式
	$: textInputStyle = `w-full rounded-md p-1 outline-none ${textInputBgStyle} ${textInputBorderStyle}`;

	let dot = true;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const updateInput = (value) => {
		dispatch('updateInput', value);
	};
</script>

<label class="flex flex-col mb-4">
	<span class="mb-1 pl-1">{label}</span>
	<div class="relative">
		<input
			type={dot ? 'password' : 'text'}
			class={textInputStyle}
			on:input={(e) => updateInput(e.target.value)}
		/>
		<button
			class="absolute right-0 top-0 w-[2em] h-full flex justify-center items-center"
			on:click={() => (dot = !dot)}
		>
			{#if dot}
				<EyeClosedIcon />
			{:else}
				<EyeIcon />
			{/if}
		</button>
	</div>
	{#if error != null}
		<span class="text-sm text-red-800 dark:text-red-300">{error}</span>
	{/if}
</label>
