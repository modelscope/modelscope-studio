<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import {
    getSlotContext,
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedTableRowSelectionSelection = importComponent(
    () => import('./table.row-selection.selection')
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
  export let text: string;
  export let built_in_selection: string | undefined;

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
    text,
    built_in_selection,
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
    text,
    built_in_selection,
    restProps: $$restProps,
  });
  $: itemProps = {
    props: {
      style: $mergedProps.elem_style,
      className: cls($mergedProps.elem_classes, 'ms-gr-antd-table-selection'),
      id: $mergedProps.elem_id,
      text: $mergedProps.text,
      ...$mergedProps.restProps,
      ...$mergedProps.props,
      ...bindEvents($mergedProps),
    },
    slots: $slots,
  };
</script>

{#await AwaitedTableRowSelectionSelection then TableRowSelectionSelection}
  <TableRowSelectionSelection
    {...itemProps.props}
    slots={itemProps.slots}
    itemSlotKey={$slotKey}
    itemBuiltIn={$mergedProps.built_in_selection}
    itemIndex={$mergedProps._internal.index || 0}
  >
    {#if $mergedProps.visible}
      <slot></slot>
    {/if}
  </TableRowSelectionSelection>
{/await}
