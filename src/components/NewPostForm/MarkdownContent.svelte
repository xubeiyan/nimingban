<script>
	export let content = '';
	import { marked } from 'marked';

	const renderer = {
		heading({ tokens, depth }) {
			const text = this.parser.parseInline(tokens);

			let fontStyle = 'text-base';
			if (depth == 1) {
				fontStyle =
					'text-3xl font-extrabold pb-1 mb-2 border-b border-slate-800 dark:border-slate-100 ';
			} else if (depth == 2) {
				fontStyle = 'text-2xl font-bold mb-2';
			} else if (depth == 3) {
				fontStyle = 'text-xl font-semibold mb-1';
			} else if (depth == 4) {
				fontStyle = 'text-lg';
			}

			return `
            <h${depth} class="${fontStyle}">
              ${text}
            </h${depth}>`;
		},

		/* 代码块 
        ```
        ```
        */
		code({ text, lang }) {
			return `
                <pre class="py-1"><code class="bg-slate-300 dark:bg-slate-700 rounded-md my-1 p-1">${text}</code></pre>
            `;
		},

		// 行内代码 ``
		codespan({ text }) {
			return `
                <code class="bg-slate-700 rounded-md p-1">${text}</code>
            `;
		},

		// 无序有序列表
		list({ ordered, start, items }) {
			let body = '';
			for (let item of items) {
				body += `${this.listitem(item)}`;
			}
			if (ordered) {
				return `
                <ol class="list-decimal" start="${start}">${body}</ol>
                `;
			} else {
				return `
                <ul class="list-disc">${body}</ul>
                `;
			}
		},

		// 无序，有序列表列表项
		listitem({ tokens }) {
            let itemBody = '';
            itemBody += this.parser.parse(tokens);
			return `<li class="ml-4">${itemBody}</li>`;
		}
	};

	marked.use({ renderer });

	$: markdownContent = (() => {
		if (content == null || content == '') {
			return '';
		}
		return marked.parse(content);
	})();
</script>

<div class="w-[50%] mt-10 markdown-preview">
	{@html markdownContent}
</div>
