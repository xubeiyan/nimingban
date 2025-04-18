<script>
	import EyeClosedIcon from '$svgIcon/eyeClosed.svelte';
	import EyeIcon from '$svgIcon/eye.svelte';

	export let error = null;
	export let label = '未知label';
	export let value = '';

	let textInputBorderStyle =
		'border border-slate-400 dark:border-zinc-500 focus-visible:border-slate-700 dark:focus-visible:border-zinc-400';
	let textInputBgStyle =
		'bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700';
	// 输入框样式
	$: textInputStyle = `w-full rounded-md px-2 py-1 outline-none ${textInputBgStyle} ${textInputBorderStyle}`;

	let dot = true;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const updateInput = (v) => {
		value = v;
		dispatch('input', v);
	};
</script>

<label class="flex flex-col mb-4">
	<span class="mb-1 pl-1">{label}</span>
	<div class="relative">
		<input
			type={dot ? 'password' : 'text'}
			class={textInputStyle}
			on:input={(e) => updateInput(e.target.value)}
			name="password"
			{value}
		/>
		{#if value != ''}
			<button
				type="button"
				class="absolute right-0 top-0 w-[2em] h-full flex justify-center items-center"
				on:click={() => (dot = !dot)}
			>
				{#if dot}
					<EyeClosedIcon />
				{:else}
					<EyeIcon />
				{/if}
			</button>
		{/if}
	</div>
	{#if error != null}
		<span class="pl-1 pt-1 text-sm text-red-800 dark:text-red-300">{error}</span>
	{/if}
</label>
