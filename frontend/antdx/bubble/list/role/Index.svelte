<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const AwaitedBubbleListRole = importComponent(() => import('./Role.svelte'));

  const props = $props();
</script>

{#await AwaitedBubbleListRole then BubbleListRole}
  <BubbleListRole {...props}>
    {@render props.children?.()}
  </BubbleListRole>
{/await}
