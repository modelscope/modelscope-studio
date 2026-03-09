<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const AwaitedXProvider = importComponent(() => import('./XProvider.svelte'));

  const props = $props();
</script>

{#await AwaitedXProvider then XProvider}
  <XProvider {...props}>
    {#snippet children()}
      {@render props.children?.()}
    {/snippet}
  </XProvider>
{/await}
