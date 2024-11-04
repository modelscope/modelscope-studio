<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';

  const AwaitedFlow = importComponent(() => import('./Awaited.svelte'));
  export let value: any;
  $: args = $$props as any;
</script>

{#await AwaitedFlow then Flow}
  <Flow {...args} {value}>
    <slot></slot>
  </Flow>
{/await}
