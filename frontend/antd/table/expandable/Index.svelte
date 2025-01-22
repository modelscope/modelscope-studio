<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
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

  const AwaitedTableExpandable = importComponent(
    () => import('./table.expandable')
  );
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
  const setSlotParams = getSetSlotParamsFn();
  $: itemProps = {
    props: {
      style: $mergedProps.elem_style,
      className: cls($mergedProps.elem_classes, 'ms-gr-antd-table-expandable'),
      id: $mergedProps.elem_id,
      ...$mergedProps.restProps,
      ...$mergedProps.props,
      ...bindEvents($mergedProps, {
        expanded_rows_change: 'expandedRowsChange',
      }),
      expandedRowClassName: createFunction(
        $mergedProps.props.expandedRowClassName ||
          $mergedProps.restProps.expandedRowClassName,
        true
      ),
      expandedRowRender: createFunction(
        $mergedProps.props.expandedRowRender ||
          $mergedProps.restProps.expandedRowRender
      ),
      rowExpandable: createFunction(
        $mergedProps.props.rowExpandable || $mergedProps.restProps.rowExpandable
      ),
      expandIcon: createFunction(
        $mergedProps.props.expandIcon || $mergedProps.restProps.expandIcon
      ),
      columnTitle:
        $mergedProps.props.columnTitle || $mergedProps.restProps.columnTitle,
    },
    slots: {
      ...$slots,
      expandIcon: {
        el: $slots['expandIcon'],
        callback: setSlotParams,
        clone: true,
      },
      expandedRowRender: {
        el: $slots['expandedRowRender'],
        callback: setSlotParams,
        clone: true,
      },
    },
  };
</script>

{#await AwaitedTableExpandable then TableExpandable}
  <TableExpandable
    {...itemProps.props}
    slots={itemProps.slots}
    itemSlotKey={$slotKey}
    itemIndex={$mergedProps._internal.index || 0}
  >
    {#if $mergedProps.visible}
      <slot></slot>
    {/if}
  </TableExpandable>
{/await}
