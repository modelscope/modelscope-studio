<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const AwaitedBubbleListItem = importComponent(() => import('./Item.svelte'));

  const props = $props();
</script>

{#await AwaitedBubbleListItem then BubbleListItem}
  <BubbleListItem {...props}>
    {@render props.children?.()}
  </BubbleListItem>
{/await}
