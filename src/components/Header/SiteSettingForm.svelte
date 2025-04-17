<script>
	import CloseIcon from '$svgIcon/close.svelte';

	import LabelInput from './SiteSettingForm/LabelInput.svelte';

	import { userStore } from '../../store/userStore';
	import { refreshToken } from '$lib/refreshToken';

	import { createMutation } from '@tanstack/svelte-query';

	let show = false;
	$: showStyle = show ? '' : 'translate-y-[-100%]';

	export const showForm = () => {
		show = true;
		getSettingList();
	};

	export const hideForm = () => {
		show = false;
	};

	export const isHide = () => !show;

	let settings = [];
	let errorText = null;
	const getSettingList = async () => {
		const res = await $queryMuatation.mutateAsync();
		if (res.type != 'ok') {
			if (res.errorCode == 'OPERATION_NOT_ALLOWED') {
				errorText = '当前用户不允许此操作';
			} else if (['COOKIES_MALFORM', 'INVALID_AUTHORIZATION_HEADER'].includes(res.errorCode)) {
				errorText = `认证字段不正确`;
			} else if (res.errorCode == 'AUTHORIZATION_EXPIRE') {
				errorText = `需要退出后重新登录`;
			}
			return;
		}
		settings = res.settings;
	};

	const queryMuatation = createMutation({
		mutationFn: async () => {
			let headers = {};

			// 有userStore.token字段则附上
			if ($userStore.token != null) {
				headers = {
					Authorization: `Bearer ${$userStore.token}`
				};
			}

			// 必要时刷新Token
			refreshToken($userStore.token);

			const res = await fetch('/manage/getSettingList', {
				headers
			}).then((r) => r.json());
			return res;
		}
	});

	// 处理更新
	const handleValueUpdate = ({ name, value }) => {
		const filtered = settings.filter((s) => s.name == name);
		if (filtered.length != 1) return;
		filtered[0].value = value;
		settings = settings;
	};
</script>

<div
	class="fixed z-10 inset-0 bg-slate-800/20 dark:bg-white/20 transition duration-500 {showStyle}"
>
	<div
		class="relative container mx-auto mt-[3em]
    bg-sky-100 dark:bg-sky-700 rounded-md px-4 py-4"
	>
		<h1 class="text-2xl">参数设置</h1>
		<button class="absolute right-4 top-4" type="button" on:click={hideForm}>
			<CloseIcon />
		</button>
		<form></form>

		{#if $queryMuatation.isPending}
			<p class="mt-2">获取中...</p>
		{:else if errorText != null}
			<div class="mt-2 px-1">
				<span
					class="border border-red-700 dark:border-red-300
                rounded-md text-red-700 dark:text-red-300
                px-2 py-1">{errorText}</span
				>
			</div>
		{:else}
			<div class="mt-2 flex flex-col gap-1">
				{#each settings as s}
					<LabelInput
						name={s.name}
						nameText={s.description}
						value={s.value}
						on:updateValue={(e) => handleValueUpdate(e.detail)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
