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
	<title>{data.siteName}</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="flex flex-col h-screen dark:[color-scheme:dark] text-slate-800 dark:text-slate-100">
		<Header siteName={data.siteName} on:message={handleMessage} {leftNavOpen} />
		<div class="flex flex-col overflow-x-hidden grow bg-gradient-to-br
		from-slate-50 to-gray-100
		 dark:from-sky-900 dark:to-cyan-900">
			<LeftNav
				open={leftNavOpen}
				forums={data.forums}
				on:click={() => {
					leftNavOpen = false;
				}}
			/>
			<LoginAndRegister open={loginAndRegistermOpen} on:message={handleMessage} />
			<slot />
			<Footer package_version={data.pkgVersion} />
		</div>
	</div>
</QueryClientProvider>
