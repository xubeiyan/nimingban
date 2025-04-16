<script>
	import { createEventDispatcher } from 'svelte';
	import StatusSelect from './StatusSelect.svelte';
	import ArrowUpRightIcon from '$svgIcon/arrowUpRight.svelte';

	const dispatch = createEventDispatcher();

	export let cookiesList = [];

	$: userTypeText = (type) => {
		if (type == 'user') {
			return '普通用户';
		}

		return '未知用户类型';
	};
</script>

<table class="w-full">
	<thead>
		<tr class="bg-sky-200 dark:bg-sky-600">
			<th>用户名</th>
			<th>用户类型</th>
			<th>用户创建时间</th>
			<th>用户状态</th>
			<th>饼干名称</th>
			<th>饼干创建时间</th>
			<th>饼干状态</th>
		</tr>
	</thead>
	<tbody>
		{#each cookiesList as c}
			<tr class="even:bg-slate-100/80 even:dark:bg-sky-800">
				<td class="text-center py-1">
					<span>{c.username}</span>
					<button
						class="bg-sky-200/80 hover:bg-sky-200
						dark:bg-sky-600/80 hover:dark:bg-sky-600 px-2 py-0.5 rounded-md"
						type="button"
						on:click={() =>
							dispatch('editSearch', {
								type: 'username',
								value: c.username
							})}>搜索所有饼干</button
					>
					<button
						class="bg-violet-200/80 hover:bg-violet-200
						dark:bg-indigo-400/80 hover:dark:bg-indigo-400
						px-2 py-0.5 rounded-md inline-flex items-center"
						type="button"
						on:click={() => {
							dispatch('searchUser', {
								username: c.username
							});
						}}
					>
						管理
						<ArrowUpRightIcon />
					</button>
				</td>
				<td class="text-center">{userTypeText(c.type)}</td>
				<td class="text-center">{c.user_create_time}</td>
				<td>
					<div class="flex justify-center">
						<StatusSelect type="user" status={c.user_status} id={c.user_id} on:updateStatus />
					</div>
				</td>
				<td class="text-center">{c.content}</td>
				<td class="text-center">{c.cookie_create_time}</td>
				<td>
					<div class="flex justify-center">
						<StatusSelect type="cookie" status={c.cookie_status} id={c.cookie_id} on:updateStatus />
					</div>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
