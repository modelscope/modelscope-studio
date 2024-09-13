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

  const AwaitedDescriptions = importComponent(() => import('./descriptions'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};
  export let title: string | undefined;
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
    title,
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
  });

  const { items, default: children } = getItems(['default', 'items']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedDescriptions then Descriptions}
    <Descriptions
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-descriptions')}
      id={$mergedProps.elem_id}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      title={$mergedProps.props.title || $mergedProps.title}
      slotItems={$items.length > 0 ? $items : $children}
    >
      <slot></slot>
    </Descriptions>
  {/await}
{/if}

<style>
</style>
