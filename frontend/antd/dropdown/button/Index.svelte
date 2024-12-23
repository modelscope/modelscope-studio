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

  import { getItems } from '../../menu/context';

  const AwaitedDropdownButton = importComponent(
    () => import('./dropdown.button')
  );

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  export let value = '';
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
  const { 'menu.items': items } = getItems(['menu.items']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedDropdownButton then DropdownButton}
    <DropdownButton
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-dropdown-button')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        open_change: 'openChange',
        menu_open_change: 'menu_OpenChange',
      })}
      slots={$slots}
      menuItems={$items}
      {setSlotParams}
      value={$mergedProps.value}
    >
      <slot></slot>
    </DropdownButton>
  {/await}
{/if}

<style>
</style>
