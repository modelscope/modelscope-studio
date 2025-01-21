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

  const AwaitedMenuItem = importComponent(() => import('./menu.item'));
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
    index?: number;
  } = {};

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
</script>

{#if $mergedProps.visible}
  {#await AwaitedMenuItem then MenuItem}
    <MenuItem
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes)}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        title_click: 'titleClick',
      })}
      slots={{
        ...$slots,
        icon: {
          el: $slots.icon,
          clone: true,
        },
      }}
      itemIndex={$mergedProps._internal.index || 0}
      itemSlotKey={$slotKey}
    >
      <slot></slot>
    </MenuItem>
  {/await}
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
