<script>
	import CloseBtn from './Dialog/CloseBtn.svelte';

	let dialog = null;
	let imageUrl = null;
	let show = false;

	export const openDialog = (url) => {
		if (dialog == null) return;
		imageUrl = url;
		show = true;
	};

	const closeDialog = () => {
		if (dialog == null) return;
		imageUrl = null;
		show = false;
	};

	$: showStyle = show ? '' : 'opacity-0 translate-y-[-100%]';
</script>

<div
	class="fixed inset-0 transition duration-500
	z-10 {showStyle} backdrop-blur-sm bg-slate-500/50
	flex justify-center items-center p-8"
	bind:this={dialog}
>
	<CloseBtn place="inBorder" on:click={closeDialog} />
	<img class="max-w-full max-h-full" alt src={imageUrl} />
</div>
