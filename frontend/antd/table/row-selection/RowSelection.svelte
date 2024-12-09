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
  import { renderItems } from '@utils/renderItems';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import { getSelectionItems, getSetRowSelectionItemFn } from '../context';

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
    restProps: $$restProps,
  });
  const { selections: selectionsItems } = getSelectionItems(['selections']);
  const setRowSelectionItem = getSetRowSelectionItemFn();
  $: {
    const events = bindEvents($mergedProps);
    setRowSelectionItem($slotKey, $mergedProps._internal.index || 0, {
      props: {
        style: $mergedProps.elem_style,
        className: cls(
          $mergedProps.elem_classes,
          'ms-gr-antd-table-row-selection'
        ),
        id: $mergedProps.elem_id,
        ...$mergedProps.restProps,
        ...$mergedProps.props,
        ...events,
        selections:
          $mergedProps.props.selections ||
          $mergedProps.restProps.selections ||
          renderItems($selectionsItems),
        onCell: createFunction(
          $mergedProps.props.onCell || $mergedProps.restProps.onCell
        ),
        getCheckboxProps: createFunction(
          $mergedProps.props.getCheckboxProps ||
            $mergedProps.restProps.getCheckboxProps
        ),
        renderCell: createFunction(
          $mergedProps.props.renderCell || $mergedProps.restProps.renderCell
        ),
        columnTitle:
          $mergedProps.props.columnTitle || $mergedProps.restProps.columnTitle,
      },
      slots: {
        ...$slots,
        selections: undefined,
        columnTitle: {
          el: $slots.columnTitle,
          callback: setSlotParams,
          clone: true,
        },
        renderCell: {
          el: $slots.renderCell,
          callback: setSlotParams,
          clone: true,
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
