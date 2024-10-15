<svelte:options accessors={true} />

<script lang="ts">
  import { bindEvents } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import { createFunction } from '@utils/createFunction';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import { getSetExpandableItemFn } from '../context';

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
    index?: number;
  } = {};

  export let as_item: string | undefined;
  export let value: string[];

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
    value,
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
    value,
    restProps: $$restProps,
  });
  const setSlotParams = getSetSlotParamsFn();
  const setExpandableItem = getSetExpandableItemFn();
  $: {
    const events = bindEvents($mergedProps);

    setExpandableItem($slotKey, $mergedProps._internal.index || 0, {
      props: {
        style: $mergedProps.elem_style,
        className: cls(
          $mergedProps.elem_classes,
          'ms-gr-antd-table-expandable'
        ),
        id: $mergedProps.elem_id,
        expandedRowKeys: $mergedProps.value,
        ...$mergedProps.restProps,
        ...$mergedProps.props,
        ...events,
        onExpandedRowsChange: (expandedKeys: string[]) => {
          events?.onExpandedRowsChange?.(expandedKeys);
          value = expandedKeys;
        },
        expandedRowClassName: createFunction(
          $mergedProps.props.expandedRowClassName
        ),
        expandedRowRender: createFunction($mergedProps.props.expandedRowRender),
        rowExpandable: createFunction($mergedProps.props.rowExpandable),
        expandIcon: $mergedProps.props.expandIcon,
        columnTitle: $mergedProps.props.columnTitle,
      },
      slots: {
        ...$slots,
        expandIcon: {
          el: $slots['expandIcon'],
          callback: setSlotParams,
        },
        expandedRowRender: {
          el: $slots['expandedRowRender'],
          callback: setSlotParams,
        },
      },
    });
  }
</script>

{#if $mergedProps.visible}
  <slot></slot>
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
