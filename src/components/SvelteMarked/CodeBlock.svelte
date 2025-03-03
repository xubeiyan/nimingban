<script>
	import hljs from 'highlight.js/lib/common';

	import { supportLang } from '$lib/MarkdownContent/utils';

	export let language = 'Plain Text';
	export let content = '';

	// 代码过长显示展开
	let blockOpen = false;
	$: codeblockStyle = blockOpen ? '' : 'overflow-y-hidden max-h-[10rem]';

	if (content.split('\n').length <= 6) {
		blockOpen = true;
	}

	$: hlContent = () => {
		const hlCode = hljs.highlight(content, {
			language
		}).value;
		return hlCode;
	};

	$: languageText = () => {
		const filtered = supportLang.filter((one) => one.name == language);
		if (filtered.length == 1) {
			return filtered[0].display;
		}

		return 'Plain Text';
	};
</script>

<div class="mb-2 relative z-0">
	<div class="bg-sky-200 dark:bg-sky-600 px-3 py-1 rounded-t-md">
		<span class="text-slate-700 dark:text-slate-200 font-bold text-sm">{languageText()}</span>
	</div>

	<pre
		class="{codeblockStyle} px-3 py-2 overflow-x-auto bg-blue-100 dark:bg-sky-900 rounded-b-md
    shadow-inner shadow-slate-300 dark:shadow-sky-950"><code>{@html hlContent()}</code></pre>

	{#if !blockOpen}
		<button
			class="absolute bottom-2 right-2  px-2 py-0.5 rounded-md 
			shadow-sm shadow-slate-300 dark:shadow-slate-600
			bg-sky-200/80 hover:bg-sky-200 dark:bg-cyan-500/80 dark:hover:bg-cyan-500"
			on:click={() => {
				blockOpen = true;
			}}>展开代码</button
		>
	{/if}
</div>

<style>
	/* Comment */
	:global(.hljs-comment, .hljs-quote) {
		color: #64748b;
	}

	:global(.dark :is(.hljs-comment, .hljs-quote)) {
		color: #94a3b8;
	}

	/* Red */
	:global(
			.hljs-variable,
			.hljs-template-variable,
			.hljs-tag,
			.hljs-name,
			.hljs-selector-id,
			.hljs-selector-class,
			.hljs-regexp,
			.hljs-deletion
		) {
		color: #f87171;
	}

	:global(
			.dark
				:is(
					.hljs-variable,
					.hljs-template-variable,
					.hljs-tag,
					.hljs-name,
					.hljs-selector-id,
					.hljs-selector-class,
					.hljs-regexp,
					.hljs-deletion
				)
		) {
		color: #ef4444;
	}

	/* Orange */
	:global(
			.hljs-number,
			.hljs-built_in,
			.hljs-literal,
			.hljs-type,
			.hljs-params,
			.hljs-meta,
			.hljs-link
		) {
		color: #fb923c;
	}

	:global(
			.dark
				:is(
					.hljs-number,
					.hljs-built_in,
					.hljs-literal,
					.hljs-type,
					.hljs-params,
					.hljs-meta,
					.hljs-link
				)
		) {
		color: #f97316;
	}

	/* Yellow */
	:global(.hljs-attribute) {
		color: #ca8a04;
	}

	:global(.dark .hljs-attribute) {
		color: #facc15;
	}

	/* Green */
	:global(.hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition) {
		color: #16a34a;
	}

	:global(.dark :is(.hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition)) {
		color: #4ade80;
	}

	/* Blue */
	:global(.hljs-title, .hljs-section) {
		color: #60a5fa;
	}

	:global(.dark :is(.hljs-title, .hljs-section)) {
		color: #818cf8;
	}

	/* Purple */
	:global(.hljs-keyword, .hljs-selector-tag) {
		color: #c084fc;
	}

	:global(.dark :is(.hljs-keyword, .hljs-selector-tag)) {
		color: #e879f9;
	}

	/* Subst */
	:global(.hljs-subst) {
		color: #d97706;
	}

	:global(.dark .hljs-subst) {
		color: #fbbf24;
	}

	/* Property */
	:global(.hljs-property) {
		color: #f472b6;
	}

	:global(.dark .hljs-property) {
		color: #ec4899;
	}
</style>
