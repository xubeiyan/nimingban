<script>
	export let language = 'Plain Text';
	export let content = '';
</script>

<div class="mb-2">
	<div class="bg-sky-200 dark:bg-sky-700 px-3 py-1 rounded-t-md">
		<span class="text-slate-700 dark:text-slate-300 font-bold text-sm">{language}</span>
	</div>
	<pre
		class="px-3 py-2 bg-blue-100 dark:bg-sky-900 rounded-b-md
    shadow-inner shadow-slate-300 dark:shadow-sky-950"><code>{content}</code></pre>
</div>
