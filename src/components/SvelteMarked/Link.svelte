<script>
	export let text = '';
	export let url = '#';

	// 根据是否是以#开始选择是否以新窗口打开
	$: target = url[0] == '#' ? '_self' : '_blank';
</script>

<a class="text-blue-500 dark:text-blue-200 underline" {target} href={url}>{text}</a>
