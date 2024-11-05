<script>
    export let border = 'single';
    $: style = border == 'double' ? 'border-t-4 border-double' : '';
</script>

<hr class="border-slate-800 dark:border-sky-500 {style}" />