<script>
	import KeyIcon from '../assets/svg-icons/key.svelte';
	import ForwardIcon from '../assets/svg-icons/forward.svelte';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	const closeLoginForm = () => {
		dispatch('message', {
			type: 'closeLoginForm'
		});
	};

	export let open;
	$: open_class = open ? 'translate-x-0' : 'translate-x-[100%]';
</script>

<div
	class="absolute right-0 w-full {open_class} h-full bg-slate-800/20 dark:bg-slate-800/90 
  Ftransition-transform duration-500 ease-in-out"
>
	<div class="container h-full m-auto flex justify-end">
		<div
			class="relative w-full bg-sky-50 dark:bg-sky-800 h-[30em] mt-2 md:mt-8 rounded-md shadow-sm px-8 py-16"
		>
			<button
				class="absolute border border-zinc-200 dark:border-zinc-300 bg-zinc-200 dark:bg-zinc-100
      rounded-md size-[2em] flex justify-center items-center top-4 right-4"
				on:click={closeLoginForm}
			>
				<ForwardIcon />
			</button>
			<form>
				<h2 class="text-4xl flex gap-4 justify-center items-center dark:text-zinc-100">
					<KeyIcon />
					登录
				</h2>
				<div class="w-72 m-auto pt-10 dark:text-zinc-100">
					<label class="flex flex-col mb-4">
						<span class="mb-1 pl-1">登录名称</span>
						<input
							type="text"
							class="rounded-md border border-zinc-300 dark:border-zinc-600 
              focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400
              bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700
              text-zinc-900 dark:text-zinc-50
              p-1 outline-none"
						/>
					</label>
					<label class="flex flex-col mb-4">
						<span class="mb-1 pl-1">密码</span>
						<input
							type="password"
							class="rounded-md border border-zinc-300 dark:border-zinc-600 
              focus-visible:border-zinc-500 dark:focus-visible:border-zinc-400
              bg-zinc-50 dark:bg-zinc-800 focus-visible:bg-white dark:focus-visible:bg-zinc-700
              text-zinc-900 dark:text-zinc-50
              p-1 outline-none"
						/>
					</label>
					<button
						class="w-full h-12 dark:text-zinc-900 bg-sky-600 hover:bg-sky-500 dark:bg-sky-200 hover:dark:bg-sky-300 text-zinc-100 rounded-md"
					>
						登入
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
