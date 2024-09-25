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

  const AwaitedListItemMeta = importComponent(() => import('./list.item.meta'));
  export let gradio: Gradio;
  export let _internal: Record<string, any> = {};
  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  // gradio properties
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  export let visible = true;
  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    restProps: $$restProps,
  });
  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    restProps: $$restProps,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedListItemMeta then ListItemMeta}
    <ListItemMeta
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-list-item-meta')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
    >
      <slot></slot>
    </ListItemMeta>
  {/await}
{/if}

<style>
</style>
