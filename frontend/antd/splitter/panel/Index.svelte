<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlotKey } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { type Writable, writable } from 'svelte/store';

  const AwaitedSplitterPanel = importComponent(
    () => import('./splitter.panel')
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

  const slot: Writable<HTMLElement> = writable();

  $: itemProps = {
    props: {
      style: $mergedProps.elem_style,
      className: cls($mergedProps.elem_classes, 'ms-gr-antd-splitter-panel'),
      id: $mergedProps.elem_id,
      ...$mergedProps.restProps,
      ...$mergedProps.props,
      ...bindEvents($mergedProps),
    },
    slots: {},
  };
</script>

{#await AwaitedSplitterPanel then SplitterPanel}
  <SplitterPanel
    {...itemProps.props}
    slots={itemProps.slots}
    itemIndex={$mergedProps._internal.index || 0}
    itemSlotKey={$slotKey}
    itemElement={$slot}
  >
    {#if $mergedProps.visible}
      <svelte-slot bind:this={$slot}>
        <slot></slot>
      </svelte-slot>
    {/if}
  </SplitterPanel>
{/await}

<style>
  svelte-slot {
    display: none;
  }
</style>
