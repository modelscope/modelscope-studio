<svelte:options accessors={true} />

<script lang="ts">
  import { importComponent } from '@svelte-preprocess-react/component';
  import {
    getConfigType,
    getLoadingStatus,
  } from '@svelte-preprocess-react/provider';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedAutoLoading = importComponent(() => import('./auto-loading'));

  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));

  // gradio properties
  export let gradio: Gradio;
  export let visible = true;
  export let _internal = {};
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

  const [mergedProps, update] = getSlotContext(
    {
      gradio,
      props: $updatedProps,
      _internal,
      as_item,
      visible,
      elem_id,
      elem_classes,
      elem_style,
      restProps: $$restProps,
    },
    undefined,
    { shouldSetLoadingStatus: false }
  );
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    restProps: $$restProps,
  });

  const configType = getConfigType();
  const slots = getSlots();
  const setSlotParams = getSetSlotParamsFn();
  const [loadingStatus, updateOptions] = getLoadingStatus({
    generating: $mergedProps.restProps.generating,
    error: $mergedProps.restProps.showError,
  });
  $: updateOptions({
    generating: $mergedProps.restProps.generating,
    error: $mergedProps.restProps.showError,
  });
</script>

{#if visible}
  {#await AwaitedAutoLoading then AutoLoading}
    <AutoLoading
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-auto-loading')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      slots={$slots}
      {configType}
      {setSlotParams}
      loadingStatus={$loadingStatus}
    >
      <slot></slot>
    </AutoLoading>
  {/await}
{/if}

<style>
</style>
