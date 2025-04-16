<script>
	import StatusSelect from '../CookiesManageForm/StatusSelect.svelte';
	export let userList = [];
</script>

<table class="w-full">
	<thead>
		<tr class="bg-sky-200 dark:bg-sky-600">
			<th>用户名</th>
			<th>用户类型</th>
			<th>用户密码</th>
			<th>用户状态</th>
			<th>用户创建时间</th>
		</tr>
	</thead>
	<tbody>
		{#each userList as u}
			<tr class="even:bg-sky-200/50 even:dark:bg-sky-600/60">
				<td class="text-center">{u.username}</td>
				<td class="text-center">{u.type}</td>
				<td> </td>
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
