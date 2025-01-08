<script>
	import { text } from '@sveltejs/kit';

	import Heading from '../SvelteMarked/Heading.svelte';
	import Blockquote from '../SvelteMarked/Blockquote.svelte';
	import Paragraph from '../SvelteMarked/Paragraph.svelte';
	import Page from '../../routes/+page.svelte';
	import HoriRule from '../SvelteMarked/HoriRule.svelte';

	import { supportLang } from '$lib/MarkdownContent/utils';
	import CodeBlock from '../SvelteMarked/CodeBlock.svelte';
	import UnorderList from '../SvelteMarked/UnorderList.svelte';
	import OrderList from '../SvelteMarked/OrderList.svelte';
	import Table from '../SvelteMarked/Table.svelte';

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
		// 替换多个\n为两个\n
		input = input.replace(/\n{3,}/g, '\n\n');

		// 在表格区块
		let inTable = false;
		let hasHeader = false;
		let tableTemp = [];
		// 在代码块区块
		let inCodeBlock = false;
		let codeBlockTemp = [];
		// 在列表区块
		let inList = false;
		let listType = '';
		let listTemp = [];
		// 缓冲区
		const inputArray = input.split('\n');
		for (let line of inputArray) {
			/**
			 * codeblock 是如下形式
			 ```[lang]
			 ...
			 ```
			 */
			if (line.substring(0, 3) == '```') {
				inTable = false;
				inList = false;
				inCodeBlock = !inCodeBlock;
				// 退出了codeblock
				if (!inCodeBlock) {
					codeBlockTemp.push(line);
					const codeBlockObj = codeBlockLexer(codeBlockTemp);
					result.children.push(codeBlockObj);

					codeBlockTemp = [];
					continue;
				}
			}

			if (inCodeBlock) {
				codeBlockTemp.push(line);
				continue;
			}

			/**
			 * list 是如下形式
			 - first
			 - second
			 - third
			 或者如下
			 3. 三个饼
			 4. 四杯水
			 5. 五根薯条
			*/

			if (new Set(['- ', '+ ', '* ']).has(line.substring(0, 2))) {
				// 检查是否已经在order中，有要退出
				if (inList && listType == 'order') {
					const listObj = listLexer(listTemp, 'order');
					result.children.push(listObj);
					listTemp = [];
				}

				listType = 'unoreder';
				inList = true;
				inTable = false;
				inCodeBlock = false;
				listTemp.push(line);
				continue;
			} else if (/^\d{1,2}\. .?/.test(line)) {
				// 检查是否已经在unorder中，有要退出
				if (inList && listType == 'unorder') {
					const listObj = listLexer(listTemp, 'unorder');
					result.children.push(listObj);
					listTemp = [];
				}
				listType = 'order';
				inList = true;
				inTable = false;
				inCodeBlock = false;
				listTemp.push(line);
				continue;
			} else {
				inList = false;
				// 退出了list
				if (listTemp.length > 0) {
					const listObj = listLexer(listTemp, listType);
					result.children.push(listObj);
					listTemp = [];
				}
				listType = '';
			}

			/**
			 * table是如下形式
			 | head1 | head2 | head3 |
			 | ----- | ----- | ----- |
			 | content1 | content2 | content3 |
			 */
			if (line.slice(0, 1) == '|' && line.slice(-1) == '|') {
				if (inTable == false) {
					inTable = true;
				}

				if (hasHeader) {
					tableTemp.push(tableLineLexer(line, 'body'));
				} else {
					tableTemp.push(tableLineLexer(line, 'header'));
					hasHeader = true;
				}
				continue;
			}

			if (inTable) {
				// 必须是三个或以上才会渲染成表格
				if (tableTemp.length >= 3) {
					const tableObj = tableLexer(tableTemp);
					result.children.push(tableObj);
				} else {
					result.children.push(...tableTemp.map((one) => inlineLexer(one.rawText)));
				}
				inTable = false;
				hasHeader = false;
				tableTemp = [];
			}

			// 是普通一行
			const lineObj = inlineLexer(line);

			result.children.push(lineObj);
		}

		// 处理解析完但代码块缓存还有数据的情况
		if (codeBlockTemp.length > 0) {
			codeBlockTemp.push('```');
			const codeBlockObj = codeBlockLexer(codeBlockTemp);
			codeBlockTemp = [];
			result.children.push(codeBlockObj);
		}

		// 处理解析完但列表块缓存还有数据的情况
		if (listTemp.length > 0) {
			const listObj = listLexer(listTemp, listType);
			result.children.push(listObj);
			listTemp = [];
		}

		// 处理解析完成但表格缓存还有数据的情况
		// 至少需要三行才会渲染表格
		if (tableTemp.length >= 3) {
			const tableObj = tableLexer(tableTemp);
			result.children.push(tableObj);
			inTable = false;
			hasHeader = false;
			tableTemp = [];
		} else {
			result.children.push(...tableTemp.map((one) => inlineLexer(one.rawText)));
		}

		// console.log(result.children);

		return result;
	};

	// 返回codeblock节点
	const codeBlockLexer = (codeblockArray) => {
		// console.log(codeblockArray);
		const langText = codeblockArray[0].substring(3);

		let language = '普通文本';

		if (langText != '') {
			const filtered = supportLang.filter((one) => one.name == langText);
			if (filtered.length == 1) {
				language = filtered[0].name;
			}
		}

		codeblockArray.shift();
		codeblockArray.pop();

		let content = codeblockArray.join('\n');

		return {
			type: 'codeblock',
			language,
			content
		};
	};

	// 返回list节点
	const listLexer = (tempList, listType = 'unorder') => {
		let type = listType == 'order' ? 'orderlist' : 'unorderlist';
		return {
			type,
			children: tempList.map((one) => {
				const removePrefixItem = one.split(' ').toSpliced(0, 1).join(' ');
				return {
					type: 'listitem',
					children: restInlineLexer(removePrefixItem, ['list'])
				};
			})
		};
	};

	// 返回table行节点
	const tableLineLexer = (tableLine, lineType = 'body') => {
		const tableRow = tableLine.split('|');
		const tableRowObj = {
			type: 'tablerow',
			rawText: tableLine,
			lineType,
			children: []
		};

		tableRow
			.map((one) => one.trim())
			.filter((one) => one != '')
			.forEach((one) => {
				if (/^-+$/.test(one)) {
					tableRowObj.lineType = 'line';
				}
				tableRowObj.children.push(restInlineLexer(one));
			});

		return tableRowObj;
	};

	// 返回table节点
	const tableLexer = (tableTemp) => {
		const tableObj = {
			type: 'table',
			header: [],
			body: []
		};

		for (let line of tableTemp) {
			if (line.lineType == 'header') {
				tableObj.header.push(line);
			} else if (line.lineType == 'body') {
				tableObj.body.push(line);
			}
		}

		return tableObj;
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

	// 返回link节点
	const linkLexer = (linkText, linkUrl) => {
		return {
			type: 'link',
			text: linkText,
			url: linkUrl
		};
	};

	// 返回image节点
	const imageLexer = (alt, url, title) => {
		return {
			type: 'image',
			alt,
			url,
			title: title == undefined ? '' : title
		};
	};

	// 返回spoiler节点
	const spoilerLexer = (inlineInput, inToken = []) => {
		return {
			type: 'spolier',
			children: restInlineLexer(inlineInput, [...inToken, 'spoiler'])
		};
	};

	// 处理已经被解析为行节点的剩余部分
	// 只处理 emphasis(强调 *...*) strong(加粗 **...**) 删除线(~~...~~)
	// inlineCode(行内代码 `...`) link(链接 [...](...)) image(图片 ![...](... ..))
	// 增加spolier(行内代码 >!...!<)
	const restInlineLexer = (inlineInput, inToken = []) => {
		let children = [];
		let i;
		for (i = 0; i < inlineInput.length; ++i) {
			// 包含这些字符，认为不是text节点
			if ('*`[!~'.includes(inlineInput[i])) {
				break;
			}

			// spoiler
			if (inlineInput[i] == '>' && inlineInput[i + 1] == '!') {
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
				}
				return children;
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
				}
				return children;
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
				}
				return children;
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
				}
				return children;
			}
		}
		// 处理link节点
		let linkRegex = /^\[(.+?)\]\((.+?)\)(.*)/.exec(inlineInput);
		if (linkRegex != null) {
			children.push(linkLexer(linkRegex[1], linkRegex[2]));
			// 处理后面部分
			if (linkRegex[3] != '') {
				children.push(...restInlineLexer(linkRegex[3], inToken));
			}
			return children;
		}

		// 处理image节点
		let imageRegex = /^!\[(.*?)\]\((.+?)(?: \"(.+?)\")?\)(.*)/.exec(inlineInput);
		if (imageRegex != null) {
			children.push(imageLexer(imageRegex[1], imageRegex[2], imageRegex[3]));
			if (imageRegex[4] != '') {
				children.push(...restInlineLexer(imageRegex[4], inToken));
			}

			return children;
		}

		// 处理spolier节点
		if (!inToken.includes('spolier')) {
			let spolierRegex = /^\>!(.+?)!\<(.*)/.exec(inlineInput);
			if (spolierRegex != null) {
				children.push(spoilerLexer(spolierRegex[1], inToken));
				// 处理后面的部分
				if (spolierRegex[2] != '') {
					children.push(...restInlineLexer(spolierRegex[2], inToken));
				}
				return children;
			}
		}

		children.push({
			type: 'text',
			content: inlineInput
		});
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
		let quoteRegex = /^> (.+)/.exec(inlineInput);
		if (quoteRegex != null) {
			return {
				type: 'blockquote',
				children: restInlineLexer(quoteRegex[1])
			};
		}

		// 尝试单线hr
		let hrRegex = /^-{6,}$/.exec(inlineInput);
		if (hrRegex != null) {
			return {
				type: 'horizontalRule',
				border: 'single'
			};
		}

		// 尝试双线hr
		let hrDoubleRegex = /^={6,}$/.exec(inlineInput);
		if (hrDoubleRegex != null) {
			return {
				type: 'horizontalRule',
				border: 'double'
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
		{:else if one.type == 'horizontalRule'}
			<HoriRule border={one.border} />
		{:else if one.type == 'paragraph'}
			<Paragraph children={one.children} on:largeImage />
		{:else if one.type == 'codeblock'}
			<CodeBlock language={one.language} content={one.content} />
		{:else if one.type == 'unorderlist'}
			<UnorderList children={one.children} />
		{:else if one.type == 'orderlist'}
			<OrderList children={one.children} />
		{:else if one.type == 'table'}
			<Table header={one.header} body={one.body} />
		{/if}
	{/each}
</div>
