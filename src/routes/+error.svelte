<script>
	import { page } from '$app/stores';
</script>

<div class="grow container mx-auto">
	<div class="mt-8 bg-slate-100 dark:bg-sky-700 shadow-inner rounded-md px-6 py-4">
		<span>抱歉，这个页面没有找到</span>
		<details class="mt-4">
			<summary class="text-slate-400 dark:text-slate-300 cursor-pointer">查看错误详情</summary>
			<div class="grid grid-cols-2 gap-1 bg-slate-200 dark:bg-sky-600 rounded-md p-1">
				<span class="bg-slate-300 dark:bg-sky-700 px-2 py-0.5 rounded-md">键</span>
				<span class="bg-slate-300 dark:bg-sky-700 px-2 py-0.5 rounded-md">值</span>
				<span class="px-2 py-0.5">错误代号 (status)</span>
				<span class="px-2 py-0.5">{$page.status}</span>
				<span class="px-2 py-0.5">错误消息 (error.message)</span>
				<span class="px-2 py-0.5">{$page.error?.message}</span>
			</div>
		</details>
		<div class="mt-4">
			<a href="/" class="inline-block bg-sky-200/80 hover:bg-sky-200 dark:bg-sky-600/80 dark:hover:bg-sky-600 px-4 py-2 rounded-md">返回首页</a>
		</div>
	</div>
	<div></div>
</div>
