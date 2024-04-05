<script>
  import KeyIcon from "../assets/svg-icons/key.svelte";

  export let open;
  $: open_class = open ? 'translate-x-0' : 'translate-x-[100%]';
</script>

<div class="absolute right-0 w-full {open_class} h-full bg-slate-800/20 dark:bg-slate-800/90 transition-transform duration-500 ease-in-out">
  <div class="container h-full m-auto flex justify-end">
    <div class="w-full bg-sky-50 dark:bg-sky-800 h-[30em] mt-8 rounded-md shadow-sm p-8">
      <form>
        <h2 class="text-2xl flex gap-4 justify-center items-center dark:text-zinc-100">
          <KeyIcon />
          登录
        </h2>
      </form>
    </div>
  </div>
</div>