<script>
  import "../app.css";
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<svelte:head>
  <title>匿名版</title>
</svelte:head>

<div class="flex flex-col h-screen">
  <Header />
  <slot />
  <Footer />
</div>