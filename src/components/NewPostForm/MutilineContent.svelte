<script>
	export let label = '正文';
	export let replyContent = null;
	export let value = '';
	let inputStyle = `outline-none 
        border border-slate-300 
        focus-within:border-slate-600 focus-within:dark:border-slate-400 
        dark:border-slate-600 focus-within:dark:bg-slate-600 
        dark:bg-slate-700 rounded-md`;
</script>

<label class="grow flex flex-col gap-1 mt-3">
	<span>{label}</span>
	{#if replyContent != null}
		<p class="border border-slate-400 rounded-md px-2 py-1">{replyContent}</p>
	{/if}
	<div class="grow-wrap grid">
		<textarea name="content" class="{inputStyle} px-2 py-0.5" bind:value on:input onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
	</div>
</label>

<style>
	.grow-wrap::after {
		content: attr(data-replicated-value) " ";
		white-space: pre-wrap;
		visibility: hidden;
	}

	.grow-wrap > textarea {
		resize: none;
		overflow: hidden;
	}

	.grow-wrap::after,
	.grow-wrap > textarea {
		/* Identical styling required!! */
		font: inherit;

		/* Place on top of each other */
		grid-area: 1 / 1 / 2 / 2;
	}
</style>
