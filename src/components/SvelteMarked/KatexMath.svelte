<script>
    import katex from 'katex';
    import '../../assets/katex.min.css';

    export let math;
    export let displayMode = false;

    const options = {
        displayMode: displayMode,
        throwOnError: false
    }

    $: katexString = katex.renderToString(math, options)
</script>

{@html katexString}