<script>
  import LoginIcon from "../assets/svg-icons/login.svelte";
  import WidgetIcon from '../assets/svg-icons/widget.svelte';

  import DarkModeSwitch from "./darkModeSwitch.svelte";
</script>
<nav class="bg-sky-100 dark:bg-sky-950 p-2 flex justify-center">
  <div class="container flex justify-between items-center">
    <div class="flex gap-2 items-center dark:text-white">
      <button class="border border-sky-900 bg-sky-50 hover:bg-sky-200 size-[2em] flex justify-center items-center rounded-md">
        <WidgetIcon />
      </button>
      <span>匿名版</span>
    </div>
    <div class="flex gap-2 items-center">
      <button class="size-[2em] border border-zinc-200 rounded-md bg-sky-600 hover:bg-sky-500 dark:bg-sky-100 flex justify-center items-center">
        <LoginIcon />
      </button>
      <DarkModeSwitch />
    </div>
  </div>
</nav>