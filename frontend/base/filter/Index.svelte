<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import {
    // getSetSlotContextFn,
    getSlotContext,
  } from '@svelte-preprocess-react/slot';

  const AwaitedFilter = importComponent(() => import('./filter'));

  export let as_item: string | undefined;
  export let params_mapping: string;
  // gradio properties
  export let visible = true;
  export let _internal = {};

  const [mergedProps, update] = getSlotContext(
    {
      _internal,
      as_item,
      visible,
      params_mapping,
      restProps: $$restProps,
    },
    undefined,
    {
      shouldRestSlotKey: false,
    }
  );
  $: update({
    _internal,
    as_item,
    visible,
    params_mapping,
    restProps: $$restProps,
  });
  $: paramsMapping = $mergedProps.params_mapping;

  // const setSlotContext = getSetSlotContextFn();

  // $: {
  //   const {
  //     _internal: _,
  //     as_item: _as_item,
  //     visible: _visible,
  //     ...restProps
  //   } = $mergedProps;
  //   if (paramsMappingFn) {
  //     setSlotContext(paramsMappingFn(restProps));
  //   } else {
  //     if (!as_item) {
  //       setSlotContext(undefined);
  //     } else {
  //       setSlotContext(restProps);
  //     }
  //   }
  // }
</script>

{#if $mergedProps.visible}
  {#await AwaitedFilter then Filter}
    <Filter
      {...$mergedProps.restProps}
      {paramsMapping}
      slots={{}}
      asItem={$mergedProps.as_item}
    >
      <slot />
    </Filter>
  {/await}
{/if}

<style>
  :global(.ms-gr-noop-class) {
    display: none;
  }
</style>
