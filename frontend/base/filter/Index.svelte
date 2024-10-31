<svelte:options accessors={true} />

<script lang="ts">
  import {
    getSetSlotContextFn,
    getSlotContext,
  } from '@svelte-preprocess-react/slot';
  import { createFunction } from '@utils/createFunction';

  export let as_item: string | undefined;
  export let params_mapping: string;
  // gradio properties
  export let visible = true;
  export let _internal = {};

  const [mergedProps, update] = getSlotContext({
    _internal,
    as_item,
    visible,
    params_mapping,
  });
  $: update({
    _internal,
    as_item,
    visible,
    params_mapping,
  });
  $: paramsMapping = $mergedProps.params_mapping;
  $: paramsMappingFn = createFunction(paramsMapping);

  const setSlotContext = getSetSlotContextFn();

  $: {
    const {
      _internal: _,
      as_item: _as_item,
      visible: _visible,
      ...restProps
    } = $mergedProps;
    if (paramsMappingFn) {
      setSlotContext(paramsMappingFn(restProps));
    } else {
      if (!as_item) {
        setSlotContext(undefined);
      } else {
        setSlotContext(restProps);
      }
    }
  }
</script>

{#if $mergedProps.visible}
  <slot />
{/if}

<style>
  :global(.ms-gr-noop-class) {
    display: none;
  }
</style>
