<script>
	export let btnText = '未知按钮';
	export let disable = false;

	$: curserStyle = disable ? 'cursor-not-allowed' : '';
</script>

<button
	disabled={disable}
	on:click
	class="bg-sky-400 hover:bg-sky-300
 dark:bg-sky-600 hover:dark:bg-sky-500
    {curserStyle}
 text-white rounded-md w-full block py-2"
>
	{btnText}
</button>
