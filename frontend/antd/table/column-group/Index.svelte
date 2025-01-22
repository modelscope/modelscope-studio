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

  const AwaitedTableColumnGroup = importComponent(
    () => import('./table.column-group')
  );
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: Record<string, any> = {};
  export let title: string;
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
    title,
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
    title,
    restProps: $$restProps,
  });

  $: itemProps = {
    props: {
      style: $mergedProps.elem_style,
      className: cls(
        $mergedProps.elem_classes,
        'ms-gr-antd-table-column-group'
      ),
      id: $mergedProps.elem_id,
      title: $mergedProps.title,
      ...$mergedProps.restProps,
      ...$mergedProps.props,
      ...bindEvents($mergedProps),
    },
    slots: $slots,
  };
</script>

{#await AwaitedTableColumnGroup then TableColumnGroup}
  <TableColumnGroup
    {...itemProps.props}
    slots={itemProps.slots}
    itemSlotKey={$slotKey}
    itemIndex={$mergedProps._internal.index || 0}
  >
    {#if $mergedProps.visible}
      <slot></slot>
    {/if}
  </TableColumnGroup>
{/await}
