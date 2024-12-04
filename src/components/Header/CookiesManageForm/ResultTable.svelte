<script>
	import { createEventDispatcher } from 'svelte';
	import StatusSelect from './StatusSelect.svelte';

	const dispatch = createEventDispatcher();

	export let cookiesList = [];
</script>

<table class="w-full">
	<thead>
		<tr class="bg-sky-200 dark:bg-sky-600">
			<th>用户名</th>
			<th class="w-[7em]"></th>
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
				<td class="text-center py-1">{c.username} </td>
				<td>
					<button
						class="bg-sky-200/80 hover:bg-sky-200
                        dark:bg-sky-600/80 hover:dark:bg-sky-600 px-2 py-0.5 rounded-md"
						type="button"
						on:click={() =>
							dispatch('editSearch', {
								type: 'username',
								value: c.username
							})}>搜索此用户</button
					>
				</td>
				<td class="text-center">{c.type}</td>
				<td class="text-center">{c.user_create_time}</td>
				<td class="flex justify-center">
					<StatusSelect
						type="user"
						status={c.user_status}
						id={c.user_id}
						on:updateStatus
					/>
				</td>
				<td class="text-center">{c.content}</td>
				<td class="text-center">{c.cookie_create_time}</td>
				<td class="flex justify-center">
					<StatusSelect
						type="cookie"
						status={c.cookie_status}
						id={c.cookie_id}
						on:updateStatus
					/>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
