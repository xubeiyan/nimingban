<script>
	import { onMount } from 'svelte';

	export let label = '正文';
	export let replyContent = null;
	export let value = '';
	export let expand = false;
	let inputStyle = `outline-none 
        border border-slate-300 
        focus-within:border-slate-600 focus-within:dark:border-slate-400 
        dark:border-slate-600 focus-within:dark:bg-slate-600 
        dark:bg-slate-700 rounded-md`;

	$: expandStyle = expand ? 'w-[50%]' : 'grow';
</script>

<label class="flex flex-col gap-1 mt-3 {expandStyle}">
	<span>{label}</span>
	{#if replyContent != null}
		<p class="border border-slate-400 rounded-md px-2 py-1">{replyContent}</p>
	{/if}
	<div class="grow-wrap grid" data-replicated-value={value}>
		<textarea
			name="content"
			class={inputStyle}
			bind:value
			on:input
			onInput="this.parentNode.dataset.replicatedValue = this.value"
		></textarea>
	</div>
</label>

<style>
	.grow-wrap {
		--x-padding: 0.5rem;
	}

	.grow-wrap::after {
		content: attr(data-replicated-value) ' ';
		white-space: pre-wrap;
		visibility: hidden;
		word-break: break-all;
		padding: 0 var(--x-padding);
	}

	.grow-wrap > textarea {
		resize: none;
		overflow: hidden;
		padding: 0 var(--x-padding);
	}

	.grow-wrap::after,
	.grow-wrap > textarea {
		/* Identical styling required!! */
		font: inherit;

		/* Place on top of each other */
		grid-area: 1 / 1 / 2 / 2;
	}
</style>
