<svelte:options accessors={true} />

<script lang="ts">
  import {
    getSetSlotContextFn,
    getSlotContext,
  } from '@svelte-preprocess-react/slot';

  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let _internal = {};

  const [mergedProps, update] = getSlotContext({
    _internal,
    as_item,
    visible,
  });
  $: update({
    _internal,
    as_item,
    visible,
  });

  const setSlotContext = getSetSlotContextFn();

  $: {
    const {
      _internal: _,
      as_item: _as_item,
      visible: _visible,
      ...restProps
    } = $mergedProps;
    if (!_as_item) {
      setSlotContext(undefined);
    } else {
      setSlotContext(restProps);
    }
  }
</script>

{#if $mergedProps.visible}
  <slot />
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
