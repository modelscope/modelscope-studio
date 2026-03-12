<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import type { Snippet } from 'svelte';

  const AwaitedXProvider = importComponent(() => import('./XProvider.svelte'));

  const {
    children,
    ...props
  }: {
    children?: Snippet;
  } = $props();
</script>

{#await AwaitedXProvider then XProvider}
  <XProvider {...props}>
    {@render children?.()}
  </XProvider>
{/await}
