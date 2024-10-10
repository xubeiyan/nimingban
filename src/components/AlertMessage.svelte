<script>
	export let message = '';
	export let type = 'info';

	$: borderStyle =
		type == 'info' ? 'border-slate-400' : type == 'warning' ? 'border-amber-400' : 'border-red-400';
	$: textStyle =
		type == 'info' ? 'text-slate-400' : type == 'warning' ? 'text-amber-400' : 'text-red-400';
</script>

<div class="w-full flex justify-center">
	<div class="w-[30em] border {borderStyle} rounded-md p-4">
		<span class="{textStyle}">{message}</span>
	</div>
</div>
