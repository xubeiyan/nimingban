<script>
  import "../app.css";
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
	import LeftNav from "../components/LeftNav.svelte";
	import LoginForm from "../components/LoginForm.svelte";

  export let data;

  let leftNavOpen = false;
  let loginFormOpen = false;

  // 
  const handleMessage = (event) => {
    if (event.detail.type == 'toggleLeftNavbarOpen' ) {
      leftNavOpen = !leftNavOpen;
      loginFormOpen = false;
    } else if (event.detail.type == 'toggleLoginFormOpen') {
      loginFormOpen = !loginFormOpen;
      leftNavOpen = false;
    } else if (event.detail.type == 'closeLoginForm') {
      loginFormOpen = false;
    }
  }
</script>

<svelte:head>
  <title>匿名版</title>
</svelte:head>

<div class="flex flex-col h-screen">
  <Header on:message={handleMessage} leftNavOpen={leftNavOpen} />
  <div class="h-screen relative overflow-x-hidden">
    <LeftNav open={leftNavOpen} forums={data.forms}/>
    <LoginForm open={loginFormOpen} on:message={handleMessage}/>
    <slot />
  </div>
  <Footer />
</div>