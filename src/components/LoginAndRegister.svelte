<script>
	import LoginForm from './LoginAndRegister/LoginForm.svelte';
	import RegisterForm from './LoginAndRegister/RegisterForm.svelte';
	import ResetPassForm from './LoginAndRegister/ResetPassForm.svelte';

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
	};

	export let open = false;
	$: openClass = open ? 'translate-x-0' : 'translate-x-[100%]';

	// 显示哪个stage，初始为登录界面
	let stage = 'login';

	let resetPassForm = null;
	// 切换
	const handleToggleStage = ({ name, extra }) => {
		if (['login', 'register', 'reset'].includes(name)) {
			stage = name;
			if (name == 'reset' && resetPassForm != null) {
				resetPassForm.addExtraInfo(extra);
			}
		}
	};

	// 重置成功
	const handleResetOK = () => {
		stage = 'login';
		dispatch('message', {
			type: 'hideLoginAndRegister'
		});
	};
</script>

<div
	class="fixed z-10 inset-0 mt-12 {openClass} h-full bg-slate-800/20 dark:bg-white/20 transition-transform duration-500 ease-in-out"
>
	<div class="container h-full m-auto flex justify-center">
		<div
			class="flex relative overflow-x-hidden w-[60em] h-[40em]
			 bg-sky-50 dark:bg-sky-700 mt-16 p-4 rounded-xl"
		>
			<ResetPassForm
				bind:this={resetPassForm}
				{stage}
				on:toStage={(e) => handleToggleStage(e.detail)}
				on:resetOK={handleResetOK}
			/>
			<LoginForm
				{stage}
				on:toStage={(e) => handleToggleStage(e.detail)}
				on:toggleLoginFormOpen={hideLoginAndRegister}
			/>
			<RegisterForm {stage} on:toStage={(e) => handleToggleStage(e.detail)} />
			<CloseBtn on:click={toggleLoginAndRegisterHide}></CloseBtn>
		</div>
	</div>
</div>
