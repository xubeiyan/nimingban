<script>
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
			<tr>
				<td class="text-center">{u.username}</td>
				<td class="text-center">{u.type}</td>
				<td class="text-center">
					
				</td>
				<td class="text-center">{u.status}</td>
				<td class="text-center">{u.createTime}</td>
			</tr>
		{/each}
	</tbody>
</table>
