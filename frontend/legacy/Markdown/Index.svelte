<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const awaitedMarkdown = importComponent(() => import('./Awaited.svelte'));
  $: args = $$props as any;
</script>

{#await awaitedMarkdown then Markdown}
  <Markdown {...args}>
    <slot></slot>
  </Markdown>
{/await}
