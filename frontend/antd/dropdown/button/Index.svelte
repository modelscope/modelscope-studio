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
  });
  const { 'menu.items': items } = getItems(['menu.items']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedDropdownButton then DropdownButton}
    <DropdownButton
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-dropdown-button')}
      id={$mergedProps.elem_id}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      menuItems={$items}
    >
      {#if $mergedProps._internal.layout}
        <slot></slot>
      {:else}
        {$mergedProps.value}
      {/if}
    </DropdownButton>
  {/await}
{/if}

<style>
</style>
