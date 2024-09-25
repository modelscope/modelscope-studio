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

  const AwaitedMenu = importComponent(() => import('./menu'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};
  export let value: {
    open_keys?: string[];
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

  const { items, default: children } = getItems(['default', 'items']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedMenu then Menu}
    <Menu
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-menu')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      slotItems={$items.length > 0 ? $items : $children}
      openKeys={$mergedProps.props.openKeys ||
        $mergedProps.value?.open_keys ||
        undefined}
      selectedKeys={$mergedProps.props.selectedKeys ||
        $mergedProps.value?.selected_keys ||
        undefined}
      onValueChange={({ openKeys, selectedKeys }) => {
        value = {
          open_keys: openKeys,
          selected_keys: selectedKeys,
        };
      }}
    >
      <slot></slot>
    </Menu>
  {/await}
{/if}

<style>
</style>
