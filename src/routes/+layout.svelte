<script>
	import '../app.css';
	import Header from '../components/Header.svelte';
	import Footer from '../components/Footer.svelte';
	import LeftNav from '../components/LeftNav.svelte';
	import LoginAndRegister from '../components/LoginAndRegister.svelte';

	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	export let data;

	let leftNavOpen = false;
	let loginAndRegistermOpen = false;

	// 处理各种消息
	const handleMessage = (event) => {
		if (event.detail.type == 'toggleLeftNavbarOpen') {
			leftNavOpen = !leftNavOpen;
			loginAndRegistermOpen = false;
		} else if (event.detail.type == 'toggleLoginFormOpen') {
			loginAndRegistermOpen = !loginAndRegistermOpen;
			leftNavOpen = false;
		} else if (event.detail.type == 'hideLoginAndRegister') {
			loginAndRegistermOpen = false;
		}
	};
</script>

<svelte:head>
	<title>匿名版</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="flex flex-col h-screen dark:[color-scheme:dark]">
		<Header on:message={handleMessage} {leftNavOpen} />
		<div class="h-screen relative overflow-x-hidden dark:bg-sky-900 dark:text-white">
			<LeftNav
				open={leftNavOpen}
				forums={data.forums}
				on:click={() => {
					leftNavOpen = false;
				}}
			/>
			<LoginAndRegister open={loginAndRegistermOpen} on:message={handleMessage} />
			<slot />
			<Footer />
		</div>
	</div>
</QueryClientProvider>
