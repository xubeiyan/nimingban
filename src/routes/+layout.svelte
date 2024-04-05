<script>
  import "../app.css";
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
	import LeftNav from "../components/LeftNav.svelte";

  let leftNavOpen = false;

  const handleMessage = (event) => {
    if (event.detail.type == 'toggleLeftNavbarOpen' ) {
      leftNavOpen = !leftNavOpen;
    }
  }
</script>

<svelte:head>
  <title>匿名版</title>
</svelte:head>

<div class="flex flex-col h-screen">
  <Header on:message={handleMessage} leftNavOpen={leftNavOpen}/>
  <div class="h-screen relative">
    <LeftNav open={leftNavOpen}/>
    <slot />
  </div>
  <Footer />
</div>