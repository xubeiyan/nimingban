<script>
	import MarkdownContent from './NewPostForm/MarkdownContent.svelte';
	export let content = '';
</script>

<MarkdownContent {content} on:largeImage />
