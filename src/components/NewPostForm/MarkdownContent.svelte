<script>
	import { text } from '@sveltejs/kit';

	import Heading from '../SvelteMarked/Heading.svelte';
	import Blockquote from '../SvelteMarked/Blockquote.svelte';
	import Paragraph from '../SvelteMarked/Paragraph.svelte';
	import Page from '../../routes/+page.svelte';

	export let content = '';

	// 整体
	const lexer = (input) => {
		// 分词结果
		let result = {
			type: 'root',
			children: []
		};
		if (input == null) return result;
		// 替换\r\n和\r为\n
		input = input.replace(/\r\n|\r/g, '\n');

		// 在表格区块
		let inTable = false;
		// 在代码块区块
		let inCodeBlock = false;
		// 在列表区块
		let inList = false;
		// 缓冲区
		const inputArray = input.split('\n');
		for (let line of inputArray) {
			const lineObj = inlineLexer(line);

			result.children.push(lineObj);
		}

		console.log(result.children);

		return result;
	};

	// 返回text节点
	const textLexer = (content) => {
		return {
			type: 'text',
			content
		};
	};

	// 返回emphasis节点
	const emphasisLexer = (inlineInput, inToken = []) => {
		// console.log(inlineInput);
		return {
			type: 'emphasis',
			children: restInlineLexer(inlineInput, [...inToken, 'emphasis'])
		};
	};

	// 返回strong节点
	const strongLexer = (inlineInput, inToken = []) => {
		return {
			type: 'strong',
			children: restInlineLexer(inlineInput, [...inToken, 'strong'])
		};
	};

	// 返回delete节点
	const deleteLexer = (inlineInput, inToken = []) => {
		return {
			type: 'delete',
			children: restInlineLexer(inlineInput, [...inToken, 'delete'])
		};
	};

	// 返回code节点
	const codeLexer = (inlineInput) => {
		return {
			type: 'code',
			content: inlineInput
		};
	};

	// 处理已经被解析为行节点的剩余部分
	// 只处理 emphasis(强调 *...*) strong(加粗 **...**) 删除线(~~...~~)
	// inlineCode(行内代码 `...`) link(链接 [...](...)) image(图片 ![...](... ..))
	const restInlineLexer = (inlineInput, inToken = []) => {
		let children = [];
		let i;
		for (i = 0; i < inlineInput.length; ++i) {
			// 包含这些字符，认为不是text节点
			if ('*`[!~'.includes(inlineInput[i])) {
				break;
			}
		}

		// i > 0 证明有text节点
		if (i > 0) {
			children.push(textLexer(inlineInput.substring(0, i)));
			// 如果解析完了整个inlineInput则返回此次解析
			if (i == inlineInput.length) {
				return children;
			}

			// 没有则将剩下部分继续解析
			inlineInput = inlineInput.substring(i);
		}

		// 处理strong
		if (!inToken.includes('strong')) {
			let strongRegex = /^\*{2}(.+?)\*{2}(.*)/.exec(inlineInput);
			if (strongRegex != null) {
				children.push(strongLexer(strongRegex[1], inToken));
				// 处理后面的部分
				if (strongRegex[2] != '') {
					children.push(...restInlineLexer(strongRegex[2], inToken));
					return children;
				}
			}
		}

		// 处理emphasis
		if (!inToken.includes('emphasis')) {
			let emphasisRegex = /^\*(.+?)\*(.*)/.exec(inlineInput);
			if (emphasisRegex != null) {
				children.push(emphasisLexer(emphasisRegex[1], inToken));
				// 处理后面的部分
				if (emphasisRegex[2] != '') {
					children.push(...restInlineLexer(emphasisRegex[2], inToken));
					return children;
				}
			}
		}

		// 处理delete
		if (!inToken.includes('delete')) {
			let deleteRegex = /^\~\~(.+?)\~\~(.*)/.exec(inlineInput);
			if (deleteRegex != null) {
				children.push(deleteLexer(deleteRegex[1], inToken));
				// 处理后面的部分
				if (deleteRegex[2] != '') {
					children.push(...restInlineLexer(deleteRegex[2], inToken));
					return children;
				}
			}
		}

		// 处理inlineCode
		if (!inToken.includes('code')) {
			let codeRegex = /^`(.+?)`(.*)/.exec(inlineInput);
			if (codeRegex != null) {
				children.push(codeLexer(codeRegex[1], inToken));
				// 处理后面的部分
				if (codeRegex[2] != '') {
					children.push(...restInlineLexer(codeRegex[2], inToken));
					return children;
				}
			}
		}

		return children;
	};

	// 处理一行的lexer
	const inlineLexer = (inlineInput, ret = {}) => {
		// 将多个空格替换为一个
		inlineInput = inlineInput.split(/\s+/).join(' ');

		// 尝试heading
		let headingRegex = /^(#{1,4}) (.+)/.exec(inlineInput);
		if (headingRegex != null) {
			const level = headingRegex[1].length;
			const children = restInlineLexer(headingRegex[2]);
			return {
				type: 'heading',
				level,
				children
			};
		}

		// 尝试blockquote
		let quoteRegex = /> (.+)/.exec(inlineInput);
		if (quoteRegex != null) {
			return {
				type: 'blockquote',
				children: restInlineLexer(quoteRegex[1])
			};
		}

		// 都不满足则按paragraph解析
		return {
			type: 'paragraph',
			children: restInlineLexer(inlineInput)
		};
	};

	$: parsed = lexer(content);
</script>

<div class="w-full">
	{#each parsed.children as one}
		{#if one.type == 'heading'}
			<Heading level={one.level} children={one.children} />
		{:else if one.type == 'blockquote'}
			<Blockquote children={one.children} />
		{:else if one.type == 'paragraph'}
			<Paragraph children={one.children} />
		{/if}
	{/each}
</div>
