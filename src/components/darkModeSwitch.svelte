<script>
	import SunIcon from '../assets/svg-icons/sun.svelte';
	import MoonIcon from '../assets/svg-icons/moon.svelte';

	import { onMount } from 'svelte';

	let mode = 'light';

	const setMode = (mode) => {
		if (mode == 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	const changeMode = () => {
		mode = mode == 'light' ? 'dark' : 'light';
		setMode(mode);
		window.localStorage.setItem('darkMode', mode);
	};

	$: place_class = mode == 'light' ? 'translate-x-[-50%]' : 'translate-x-[50%]';
	$: bg_class = mode == 'light' ? 'bg-sky-900' : 'bg-sky-200';

	onMount(() => {
		if (window.localStorage.getItem('darkMode') == undefined) {
			window.localStorage.setItem('darkMode', mode);
		} else {
			mode = window.localStorage.getItem('darkMode');
			setMode(mode);
		}
	});
</script>

<button class="w-[3em] h-[1.5em] rounded-full border {bg_class}" on:click={() => changeMode()}>
	<span
		class="size-[1.5em] inline-flex h-full justify-center
  items-center border border-sky-700 dark:border-sky-300 bg-sky-100 dark:bg-sky-600 rounded-full {place_class}
  transition duration-300"
	>
		{#if mode == 'light'}
			<SunIcon />
		{:else}
			<MoonIcon />
		{/if}
	</span>
</button>
