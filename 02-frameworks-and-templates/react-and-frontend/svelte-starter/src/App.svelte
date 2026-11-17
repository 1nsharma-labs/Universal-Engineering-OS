<script lang="ts">
  let clicks = 0;
  let title = "Svelte Reactive Component Starter";
</script>

<main style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #fff;">
  <h1>{title}</h1>
  <p>Ultra-lightweight zero-virtual-DOM compiled UI components.</p>
  <button on:click={() => clicks++} style="padding: 10px 20px; background: #ea580c; color: white; border: none; border-radius: 6px;">
    Svelte Clicks: {clicks}
  </button>
</main>
