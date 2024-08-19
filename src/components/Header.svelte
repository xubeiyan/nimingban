<script>
	import LoginIcon from '../assets/svg-icons/login.svelte';
	import WidgetIcon from '../assets/svg-icons/widget.svelte';

	import DarkModeSwitch from './darkModeSwitch.svelte';

	import { createEventDispatcher } from 'svelte';

	export let leftNavOpen;

	const dispatch = createEventDispatcher();

	// 打开或关闭左边的导航
	const toggleLeftNavbarOpen = () => {
		dispatch('message', {
			type: 'toggleLeftNavbarOpen'
		});
	};

	// 打开或关闭右边的登录框
	const toggleLoginFormOpen = () => {
		dispatch('message', {
			type: 'toggleLoginFormOpen'
		});
	};
</script>

<nav class="bg-sky-100 dark:bg-sky-950 p-2 flex justify-center z-10 shadow-md">
	<div class="container flex justify-between items-center">
		<div class="flex gap-2 items-center dark:text-white">
			<button
				class="border border-cyan-400 dark:border-cyan-200 bg-cyan-500/70 hover:bg-cyan-400 dark:bg-cyan-100 hover:dark:bg-cyan-200 size-[2em]
      flex justify-center items-center rounded-md"
				on:click={toggleLeftNavbarOpen}
			>
				<WidgetIcon open={leftNavOpen} />
			</button>
			<span>匿名版</span>
		</div>
		<div class="flex gap-2 items-center">
			<button
				class="size-[2em] border border-zinc-200 rounded-md bg-sky-600 hover:bg-sky-500/70 dark:bg-sky-100 hover:dark:bg-sky-200 flex justify-center items-center"
				on:click={toggleLoginFormOpen}
			>
				<LoginIcon />
			</button>
			<DarkModeSwitch />
		</div>
	</div>
</nav>
