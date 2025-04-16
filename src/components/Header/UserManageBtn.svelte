<script>
	import UsersIcon from '$svgIcon/users.svelte';
</script>

<button
	class="rounded-md bg-sky-200/70 hover:bg-sky-200
dark:bg-sky-600/70 hover:dark:bg-sky-600 px-2 py-1 flex items-center gap-1"
	on:click
>
	<UsersIcon />
	<span>用户管理</span>
</button>
