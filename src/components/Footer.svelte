<script>
	import CopyleftIcon from '$svgIcon/copyleft.svelte';
	import GithubIcon from '$svgIcon/github.svelte';
</script>

<footer class="flex justify-center py-4 px-2 md:px-0">
	<div class="w-full container flex justify-between items-center ">
		<div class="inline-flex gap-1 items-center">
			<CopyleftIcon />
			<span>2024</span>
			<a href="/" class="hover:underline underline-offset-4">nimingban </a>
			<span class="text-slate-500 dark:text-slate-300 hidden md:inline">An anonymous board created with Svelte and </span>
			<span class="text-red-400 hidden md:inline">♥</span>
		</div>
		<div>
			<a href="https://github.com/xubeiyan/nimingban" target="_blank">
				<GithubIcon />
			</a>
		</div>
	</div>
</footer>
