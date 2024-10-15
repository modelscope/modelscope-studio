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
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { type Writable, writable } from 'svelte/store';

  import {
    getColumnItems,
    getExpandableItems,
    getRowSelectionItems,
  } from './context';

  const AwaitedTable = importComponent(() => import('./table'));
  export let gradio: Gradio;
  export let _internal: Record<string, any> = {};
  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  export let data_source: Record<PropertyKey, any>[];
  const updatedProps: Writable<typeof props> = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  export let visible = true;
  const slots = getSlots();
  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    data_source,
    restProps: $$restProps,
  });
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    data_source,
    restProps: $$restProps,
  });
  const setSlotParams = getSetSlotParamsFn();
  const { rowSelection: rowSelectionItems } = getRowSelectionItems([
    'rowSelection',
  ]);
  const { expandable: expandableItems } = getExpandableItems(['expandable']);

  const { default: columnItems } = getColumnItems();
</script>

{#if $mergedProps.visible}
  {#await AwaitedTable then Table}
    <Table
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-table')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      dataSource={$mergedProps.props.dataSource ?? $mergedProps.data_source}
      rowSelectionItems={$rowSelectionItems}
      expandableItems={$expandableItems}
      columnItems={$columnItems}
      {setSlotParams}
    >
      <slot></slot>
    </Table>
  {/await}
{/if}

<style>
</style>
