<svelte:options accessors={true} />

<script lang="ts">
  import { bindEvents } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlotKey } from '@svelte-preprocess-react/slot';
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
    restProps: $$restProps,
  });

  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    restProps: $$restProps,
  });

  const slot: Writable<HTMLElement> = writable();
  const setCol = getSetItemFn();
  $: {
    if ($slot) {
      setCol($slotKey, $mergedProps._internal.index || 0, {
        el: $slot,
        props: {
          style: $mergedProps.elem_style,
          className: cls($mergedProps.elem_classes, 'ms-gr-antd-col'),
          id: $mergedProps.elem_id,

          ...$mergedProps.props,
          ...bindEvents($mergedProps),
        },
        slots: {},
      });
    }
  }
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
