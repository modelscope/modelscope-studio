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
  import { writable } from 'svelte/store';

  const AwaitedTreeSelect = importComponent(() => import('./tree-select'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: Record<string, any> = {};
  export let value: string | string[];
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
  const setSlotParams = getSetSlotParamsFn();
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if $mergedProps.visible}
  {#await AwaitedTreeSelect then TreeSelect}
    <TreeSelect
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-tree-select')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        tree_expand: 'treeExpand',
        popup_scroll: 'popupScroll',
        dropdown_visible_change: 'dropdownVisibleChange',
        popup_visible_change: 'popupVisibleChange',
        load_data: 'loadData',
      })}
      slots={$slots}
      onValueChange={(val) => {
        value = val;
      }}
      {setSlotParams}
    >
      <slot></slot>
    </TreeSelect>
  {/await}
{/if}

<style>
</style>
