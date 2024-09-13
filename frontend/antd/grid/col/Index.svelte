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

  export let flex;
  export let offset;
  export let order;
  export let pull;
  export let push;
  export let span;
  export let xs;
  export let sm;
  export let md;
  export let lg;
  export let xl;
  export let xxl;
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
    flex,
    offset,
    order,
    pull,
    push,
    span,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
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
    flex,
    offset,
    order,
    pull,
    push,
    span,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
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
          flex: $mergedProps.flex,
          offset: $mergedProps.offset,
          order: $mergedProps.order,
          pull: $mergedProps.pull,
          push: $mergedProps.push,
          span: $mergedProps.span,
          xs: $mergedProps.xs,
          sm: $mergedProps.sm,
          md: $mergedProps.md,
          lg: $mergedProps.lg,
          xl: $mergedProps.xl,
          xxl: $mergedProps.xxl,
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
