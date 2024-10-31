<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const awaitedFlow = importComponent(() => import('./Awaited.svelte'));
  $: args = $$props as any;
</script>

{#await awaitedFlow then Flow}
  <Flow {...args}>
    <slot></slot>
  </Flow>
{/await}
