<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlots } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import { getItems } from './context';

  const AwaitedTree = importComponent(() => import('./tree'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: Record<string, any> = {};
  export let value: {
    expanded_keys?: string[];
    checked_keys?: string[] | { checked: string[]; halfChecked: string[] };
    selected_keys?: string[];
  } = {};
  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

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
  const { treeData, default: children } = getItems(['default', 'treeData']);

  const onValueChange = (val: Record<string, any>) => {
    value = {
      expanded_keys: val.expandedKeys,
      checked_keys: val.checkedKeys,
      selected_keys: val.selectedKeys,
    };
  };
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if $mergedProps.visible}
  {#await AwaitedTree then Tree}
    <Tree
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-tree')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      slotItems={$treeData.length ? $treeData : $children}
      selectedKeys={$mergedProps.props.selectedKeys ||
        $mergedProps.value.selected_keys}
      expandedKeys={$mergedProps.props.expandedKeys ||
        $mergedProps.value.expanded_keys}
      checkedKeys={$mergedProps.props.checkedKeys ||
        $mergedProps.value.checked_keys}
      {onValueChange}
    >
      <slot></slot>
    </Tree>
  {/await}
{/if}

<style>
</style>
