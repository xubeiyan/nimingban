<script>
	import KeyIcon from '$svgIcon/key.svelte';
	import LockIcon from '$svgIcon/lock.svelte';
	export let type = 'login';

	$: titleText = type == 'login' ? '登录' : '注册';
</script>

<div class="flex justify-center items-center gap-4 my-10">
	{#if type == 'login'}
		<LockIcon />
	{:else}
		<KeyIcon />
	{/if}
	<span class="text-3xl">{titleText}</span>
</div>
