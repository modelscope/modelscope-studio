<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import { getSlotContext } from '@svelte-preprocess-react/slot';

  const AwaitedText = importComponent(() => import('./text'));

  export let value: string = '';
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let _internal: {} = {};

  const [mergedProps, update] = getSlotContext({
    _internal,
    value,
    as_item,
    visible,
    restProps: $$restProps,
  });
  $: update({
    _internal,
    value,
    as_item,
    visible,
    restProps: $$restProps,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedText then Text}
    <Text value={$mergedProps.value} {...$mergedProps.restProps} slots={{}} />
  {/await}
{/if}
