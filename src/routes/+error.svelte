<script>
	import { page } from '$app/stores';
</script>

<div class="grow container mx-auto">
	<div class="mt-8 bg-slate-100 shadow-inner rounded-md px-6 py-4">
		<span>抱歉，这个页面没有找到</span>
		<details class="mt-1">
			<summary class="text-slate-400">查看详情</summary>
			<div class="grid grid-cols-2 gap-2 bg-slate-200 rounded-md p-2">
				<span class="bg-slate-300 px-2 py-0.5 rounded-md">键</span>
				<span class="bg-slate-300 px-2 py-0.5 rounded-md">值</span>
				<span class="px-2 py-0.5">错误代号 (status)</span>
				<span class="px-2 py-0.5">{$page.status}</span>
				<span class="px-2 py-0.5">错误消息 (error.message)</span>
				<span class="px-2 py-0.5">{$page.error?.message}</span>
			</div>
		</details>
		<div class="mt-2">
			<a href="/" class="bg-sky-200 px-4 py-1 rounded-md">返回首页</a>
		</div>
	</div>
	<div></div>
</div>
