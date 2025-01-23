<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import { getSlotContext } from '@svelte-preprocess-react/slot';

  const AwaitedFragment = importComponent(() => import('./fragment'));
  export let _internal: {
    layout?: boolean;
    index?: number;
    subIndex?: number;
  } = {};
  export let as_item: string | undefined = undefined;
  // gradio properties
  export let visible = true;

  const [mergedProps, update] = getSlotContext(
    {
      _internal,
      visible,
      as_item,
      restProps: $$restProps,
    },
    undefined,
    {
      shouldRestSlotKey: false,
    }
  );
  $: update({
    _internal,
    visible,
    as_item,
    restProps: $$restProps,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedFragment then Fragment}
    <Fragment slots={{}}>
      <slot></slot>
    </Fragment>
  {/await}
{/if}

<style>
</style>
