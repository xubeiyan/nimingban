<script>
	import ForumList from "./ForumList.svelte";

	export let open;
	export let forums = [];
	// console.log(forumList);
	$: open_class = open ? 'translate-x-0' : 'translate-x-[-100%]';
</script>

<div
	class="absolute w-full {open_class} h-full bg-slate-800/20 dark:bg-slate-800/90 transition-transform duration-500 ease-in-out"
>
	<div class="container h-full m-auto">
		<div class="w-[15em] bg-sky-100 dark:bg-sky-800 h-full p-4">
			<ForumList forums={forums}/>
		</div>
	</div>
</div>
