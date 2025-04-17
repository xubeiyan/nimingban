<script>
	export let resetPass = null;
	export let username = null;
	// 已复制
	let copied = false;
	const copyResetPassword = () => {
		if (resetPass == null) return;
		if (copied) return;
		navigator.clipboard
			.writeText(`用户名：${username} 重置密码：${resetPass}`)
			.then(() => {
				copied = true;
				setTimeout(() => {
					copied = false;
				}, 2000);
			})
			.catch((e) => {
				console.log(e);
			});
	};
</script>

<button
	class="rounded-md
    bg-lime-200/80 hover:bg-lime-200
    dark:bg-lime-600/80 hover:dark:bg-lime-600 px-2 py-0.5"
	on:click={copyResetPassword}>{copied ? '已复制' : '点击复制'}</button
>
