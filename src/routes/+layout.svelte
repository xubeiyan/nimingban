<script>
  import "../app.css";
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
	import LeftNav from "../components/LeftNav.svelte";
	import LoginForm from "../components/LoginForm.svelte";

  let leftNavOpen = false;
  let loginFormOpen = false;

  const handleMessage = (event) => {
    if (event.detail.type == 'toggleLeftNavbarOpen' ) {
      leftNavOpen = !leftNavOpen;
      loginFormOpen = false;
    } else if (event.detail.type == 'toggleLoginFormOpen') {
      loginFormOpen = !loginFormOpen;
      leftNavOpen = false;
    }
  }
</script>

<svelte:head>
  <title>匿名版</title>
</svelte:head>

<div class="flex flex-col h-screen">
  <Header on:message={handleMessage} leftNavOpen={leftNavOpen}/>
  <div class="h-screen relative overflow-x-hidden">
    <LeftNav open={leftNavOpen}/>
    <LoginForm open={loginFormOpen}/>
    <slot />
  </div>
  <Footer />
</div>