<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import type { Snippet } from 'svelte';

  const AwaitedBubbleListRole = importComponent(() => import('./Role.svelte'));

  const {
    children,
    ...props
  }: {
    children?: Snippet;
  } = $props();
</script>

{#await AwaitedBubbleListRole then BubbleListRole}
  <BubbleListRole {...props}>
    {@render children?.()}
  </BubbleListRole>
{/await}
