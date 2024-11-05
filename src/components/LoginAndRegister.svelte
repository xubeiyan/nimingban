<script>
	import LoginForm from './LoginAndRegister/LoginForm.svelte';
	import RegisterForm from './LoginAndRegister/RegisterForm.svelte';

	import CloseBtn from './LoginAndRegister/CloseBtn.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	const toggleLoginAndRegisterHide = () => {
		dispatch('message', {
			type: 'toggleLoginFormOpen'
		});
	};

    // 关闭登录或注册
    const hideLoginAndRegister = () => {
        dispatch('message', {
            type: 'hideLoginAndRegister'
        });
    }

	export let open = false;
	$: openClass = open ? 'translate-x-0' : 'translate-x-[100%]';

	// 显示左边还是右边
	let toRight = false;
	// 切换
	const handleToggleToRight = () => {
		toRight = !toRight;
	};
</script>

<div
	class="fixed w-full {openClass} h-full bg-slate-800/20 dark:bg-slate-800/90 transition-transform duration-500 ease-in-out"
>
	<div class="container h-full m-auto flex justify-center">
		<div
			class="flex relative overflow-x-hidden w-[60em] h-[40em] bg-sky-50 dark:bg-sky-800 mt-16 p-4 rounded-xl"
		>
			<LoginForm {toRight} on:toggleToRight={handleToggleToRight} on:toggleLoginFormOpen={hideLoginAndRegister} />
			<RegisterForm {toRight} on:toggleToRight={handleToggleToRight} />
			<CloseBtn on:click={toggleLoginAndRegisterHide}></CloseBtn>
		</div>
	</div>
</div>
