<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const awaitedMultimodalInput = importComponent(
    () => import('./Awaited.svelte')
  );
  $: args = $$props as any;
</script>

{#await awaitedMultimodalInput then MultimodalInput}
  <MultimodalInput {...args}>
    <slot></slot>
  </MultimodalInput>
{/await}
