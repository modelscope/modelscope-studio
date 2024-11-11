<svelte:options accessors={true} />

<script lang="ts">
  import { bindEvents } from '@svelte-preprocess-react/component';
  import {
    getSlotContext,
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { type Writable, writable } from 'svelte/store';

  import { getSetItemFn } from '../context';

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
    index?: number;
  } = {};
  export let label: string | undefined;
  export let number: number | undefined;
  export let as_item: string | undefined;

  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

  const slotKey = getSlotKey();
  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    label,
    number,
    restProps: $$restProps,
  });
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
    label,
    number,
    restProps: $$restProps,
  });
  const slot: Writable<HTMLElement> = writable();
  const setItem = getSetItemFn();

  $: setItem($slotKey, $mergedProps._internal.index || 0, {
    props: {
      style: $mergedProps.elem_style,
      className: cls($mergedProps.elem_classes, 'ms-gr-antd-slider-mark'),
      id: $mergedProps.elem_id,
      number: $mergedProps.number,
      label: $mergedProps.label,
      ...$mergedProps.restProps,
      ...$mergedProps.props,
      ...bindEvents($mergedProps),
    },
    slots: {
      ...$slots,
      children: $mergedProps._internal.layout ? $slot : undefined,
    },
  });
</script>

{#if $mergedProps.visible}
  <svelte-slot bind:this={$slot}>
    <slot></slot>
  </svelte-slot>
{/if}

<style>
  svelte-slot {
    display: none;
  }
</style>
