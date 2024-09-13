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

  import { getItems } from '../context';

  const AwaitedRow = importComponent(() => import('./row'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let align;
  export let gutter;
  export let justify;
  export let wrap;
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
    align,
    gutter,
    justify,
    wrap,
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
    align,
    gutter,
    justify,
    wrap,
  });
  const { default: cols } = getItems();
</script>

{#if $mergedProps.visible}
  {#await AwaitedRow then Row}
    <Row
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-row')}
      id={$mergedProps.elem_id}
      align={$mergedProps.align}
      gutter={$mergedProps.gutter}
      justify={$mergedProps.justify}
      wrap={$mergedProps.wrap}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      cols={$cols}
    >
      <slot />
    </Row>
  {/await}
{/if}

<style>
</style>
