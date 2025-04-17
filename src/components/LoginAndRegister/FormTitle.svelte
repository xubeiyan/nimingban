<script>
	import KeyIcon from '$svgIcon/key.svelte';
	import LockIcon from '$svgIcon/lock.svelte';
	import LockPasswordIcon from '$svgIcon/lockPassword.svelte';
	export let type = 'login';

	$: titleText = type == 'login' ? '登录' : type == 'reset' ? '重设密码' : '注册';
</script>

<div class="flex justify-center items-center gap-4 my-12">
	{#if type == 'login'}
		<LockIcon />
	{:else if type == 'reset'}
		<LockPasswordIcon />
	{:else}
		<KeyIcon />
	{/if}
	<span class="text-3xl">{titleText}</span>
</div>
