<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { FileData } from '@gradio/client';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedImage = importComponent(() => import('./image'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let value: string | FileData = '';
  export let _internal: {
    layout?: boolean;
  } = {};

  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    value,
    restProps: $$restProps,
  });
  const setSlotParams = getSetSlotParamsFn();
  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    value,
    restProps: $$restProps,
  });
  let src = '';
  $: {
    if (typeof $mergedProps.value === 'object' && $mergedProps.value) {
      src = $mergedProps.value.url || '';
    } else {
      src = $mergedProps.value;
    }
  }
</script>

{#if $mergedProps.visible}
  {#await AwaitedImage then Image}
    <Image
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-image')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        preview_visible_change: 'preview_visibleChange',
      })}
      slots={$slots}
      src={$mergedProps.props.src || src}
      {setSlotParams}
    >
      <slot />
    </Image>
  {/await}
{/if}

<style>
</style>
