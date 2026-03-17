<script>
	import { createEventDispatcher } from 'svelte';
	import StatusSelect from '../CookiesManageForm/StatusSelect.svelte';
	import ResetPassBtn from './ResetPassBtn.svelte';
	import CopyResetPassBtn from './copyResetPassBtn.svelte';
	import ArrowUpRightIcon from '$svgIcon/arrowUpRight.svelte';

	const dispatch = createEventDispatcher();

	export let userList = [];
</script>

<table class="w-full">
	<thead>
		<tr class="bg-sky-200 dark:bg-sky-600">
			<th class="py-1">用户名</th>
			<th>用户类型</th>
			<th>用户密码</th>
			<th>密码重置状态</th>
			<th>用户状态</th>
			<th>用户创建时间</th>
		</tr>
	</thead>
	<tbody>
		{#each userList as u}
			<tr class="even:bg-sky-200/50 even:dark:bg-sky-600/60">
				<td class="text-center">
					{u.username}
					{#if u.type == '一般用户'}
						<button
							class="bg-sky-200/80 hover:bg-sky-200
						dark:bg-sky-600/80 hover:dark:bg-sky-600 px-2 py-0.5 rounded-md
						inline-flex items-center"
							type="button"
							on:click={() =>
								dispatch('searchUserAllCookies', {
									username: u.username
								})}
							>搜索饼干
							<ArrowUpRightIcon />
						</button>
					{/if}
				</td>
				<td class="text-center py-1">{u.type}</td>
				<td>
					{#if u.type == '一般用户'}
						<div class="flex justify-center">
							<ResetPassBtn needReset={u.resetPass == null} id={u.id} on:updateUserList />
						</div>
					{/if}
				</td>
				<td class="text-center">
					{#if u.resetPass == null}
						<span>未重置</span>
					{:else}
						<div class="flex justify-center">
							<CopyResetPassBtn username={u.username} resetPass={u.resetPass} />
						</div>
					{/if}
				</td>
				<td>
					{#if u.type == '一般用户'}
						<div class="flex justify-center">
							<StatusSelect type="user" status={u.status} id={u.id} on:updateStatus />
						</div>
					{/if}
				</td>
				<td class="text-center">{u.createTime}</td>
			</tr>
		{/each}
	</tbody>
</table>
