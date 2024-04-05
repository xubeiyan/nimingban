<script>
  export let open;
  $: open_class = open ? 'translate-x-0' : 'translate-x-[-100%]'
</script>
<div class="absolute w-full {open_class} h-full bg-slate-800/20 transition-transform duration-500 ease-in-out">
  <div class="container h-full m-auto">
    <div class="w-[15em] bg-sky-100 h-full"></div>
  </div>
</div>