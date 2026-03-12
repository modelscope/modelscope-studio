<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import type { Snippet } from 'svelte';

  const AwaitedBubbleListItem = importComponent(() => import('./Item.svelte'));

  const {
    children,
    ...props
  }: {
    children?: Snippet;
  } = $props();
</script>

{#await AwaitedBubbleListItem then BubbleListItem}
  <BubbleListItem {...props}>
    {@render children?.()}
  </BubbleListItem>
{/await}
