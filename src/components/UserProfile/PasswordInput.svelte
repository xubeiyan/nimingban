<script>
	import EyeIcon from '$svgIcon/eye.svelte';
	import EyeClosedIcon from '$svgIcon/eyeClosed.svelte';
	let hide = true;
	export let value = '';
</script>

<div class="inline relative grow">
	<input
		type={hide ? 'password' : 'text'}
		class="bg-transparent border-b-2 w-full
    border-slate-500 focus-within:border-slate-900
	dark:border-cyan-100 focus-within:dark:border-cyan-200
    outline-none text-slate-500 dark:text-cyan-100"
		{value}
		on:input
	/>
	{#if value != ''}
		<button
			type="button"
			class="absolute right-0 top-[50%] translate-y-[-50%]"
			on:click={() => {
				hide = !hide;
			}}
		>
			{#if hide}
				<EyeClosedIcon />
			{:else}
				<EyeIcon />
			{/if}
		</button>
	{/if}
</div>
