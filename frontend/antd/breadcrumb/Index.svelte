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

  import { getItems } from './context';

  const AwaitedBreadcrumb = importComponent(() => import('./breadcrumb'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
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
  const { items, default: children } = getItems(['items', 'default']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedBreadcrumb then Breadcrumb}
    <Breadcrumb
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-breadcrumb')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        menu_open_change: 'menu_openChange',
        dropdown_open_change: 'dropdownProps_openChange',
        dropdown_menu_click: 'dropdownProps_menu_click',
        dropdown_menu_deselect: 'dropdownProps_menu_deselect',
        dropdown_menu_open_change: 'dropdownProps_menu_openChange',
        dropdown_menu_select: 'dropdownProps_menu_select',
      })}
      slots={$slots}
      slotItems={$items.length > 0 ? $items : $children}
      {setSlotParams}
    >
      <slot></slot>
    </Breadcrumb>
  {/await}
{/if}

<style>
</style>
