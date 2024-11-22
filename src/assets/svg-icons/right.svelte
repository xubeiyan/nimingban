<script>
	export let turn = 0;
	$: style = turn == 90 ? 'rotate-90' : '';
</script>

<svg
	class="fill-slate-800 dark:fill-slate-100 {style} transition"
	width="1em"
	height="1em"
	viewBox="-4.5 0 19 19"
	xmlns="http://www.w3.org/2000/svg"
	><path
		d="M1.6 17.262a1.03 1.03 0 0 1-.728-1.757l6.073-6.073L.872 3.36a1.03 1.03 0 0 1 1.455-1.455l6.8 6.8a1.03 1.03 0 0 1 0 1.456l-6.8 6.8a1.025 1.025 0 0 1-.727.302z"
	/></svg
>
