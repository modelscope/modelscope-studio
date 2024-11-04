<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const AwaitedMultimodalInput = importComponent(
    () => import('./Awaited.svelte')
  );
  export let value: any;
  $: args = $$props as any;
</script>

{#await AwaitedMultimodalInput then MultimodalInput}
  <MultimodalInput {...args} {value}>
    <slot></slot>
  </MultimodalInput>
{/await}
