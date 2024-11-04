<script>
	import TableRow from './TableRow.svelte';

	export let header = [];
	export let body = [];
</script>

<table>
	<thead>
		{#each header as h}
			<TableRow type="header" children={h.children} />
		{/each}
	</thead>
	<tbody>
		{#each body as b}
			<TableRow type="body" children={b.children} />
		{/each}
	</tbody>
</table>
