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
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedTreeSelectTreeNode = importComponent(
    () => import('./tree-select.tree-node')
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
  export let value: string;
  export let title: string;

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
    value,
    title,
    restProps: $$restProps,
  });
  const setSlotParams = getSetSlotParamsFn();
  $: itemProps = {
    props: {
      style: $mergedProps.elem_style,
      className: cls($mergedProps.elem_classes, 'ms-gr-antd-tree-select-node'),
      id: $mergedProps.elem_id,
      title: $mergedProps.title,
      value: $mergedProps.value,
      ...$mergedProps.restProps,
      ...$mergedProps.props,
      ...bindEvents($mergedProps),
    },
    slots: {
      ...$slots,
      icon: {
        el: $slots.icon,
        callback: setSlotParams,
        clone: true,
      },
    },
  };
</script>

{#if $mergedProps.visible}
  {#await AwaitedTreeSelectTreeNode then TreeSelectTreeNode}
    <TreeSelectTreeNode
      {...itemProps.props}
      slots={itemProps.slots}
      itemIndex={$mergedProps._internal.index || 0}
      itemSlotKey={$slotKey}
    >
      <slot></slot>
    </TreeSelectTreeNode>
  {/await}
{/if}
