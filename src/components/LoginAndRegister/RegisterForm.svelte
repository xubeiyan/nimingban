<script>
	import { createEventDispatcher } from 'svelte';
	import FormTitle from './FormTitle.svelte';

	export let toRight = false;
	$: toRightClass = toRight ? 'translate-x-[-100%]' : '';

	const dispatch = createEventDispatcher();

	const toLoginForm = () => {
		dispatch('toggleToRight');
	};
</script>

<div class="w-full shrink-0 {toRightClass} transition-all duration-500">
	<FormTitle type="register" />
	<div class="flex justify-center">
		<button on:click={toLoginForm}>
			<span class="text-blue-400 dark:text-blue-100 hover:underline underline-offset-4">
				已有帐号？点击登录
			</span>
		</button>
	</div>
</div>
