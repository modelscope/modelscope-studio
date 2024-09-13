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
  import { createFunction } from '@utils/createFunction';
  import { renderItems } from '@utils/renderItems';
  import { renderSlot } from '@utils/renderSlot';
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
  export let value: string[] | number[];

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
        selectedRowKeys: $mergedProps.value,
        selections:
          $mergedProps.props.selections || renderItems($selectionsItems),
        ...$mergedProps.props,
        ...events,
        onChange: (selectedRowKeys: string[] | number[], ...args: any[]) => {
          value = selectedRowKeys;
          events?.onChange?.(...args);
        },
        onCell: createFunction($mergedProps.props.onCell),
        getCheckboxProps: createFunction($mergedProps.props.getCheckboxProps),
        columnTitle:
          renderSlot($slots['columnTitle']) || $mergedProps.props.columnTitle,
      },
      slots: {},
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
