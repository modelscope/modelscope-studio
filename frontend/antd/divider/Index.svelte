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

  const AwaitedDivider = importComponent(() => import('./divider'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let value = '';
  export let dashed;
  export let variant;
  export let orientation;
  export let orientation_margin;
  export let plain;
  export let type;
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
    value,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    dashed,
    variant,
    orientation,
    orientation_margin,
    plain,
    type,
  });
  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    value,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    dashed,
    variant,
    orientation,
    orientation_margin,
    plain,
    type,
  });
  $: passed_props = {
    style: $mergedProps.elem_style,
    className: cls($mergedProps.elem_classes, 'ms-gr-antd-divider'),
    id: $mergedProps.elem_id,
    dashed: $mergedProps.dashed,
    variant: $mergedProps.variant,
    orientation: $mergedProps.orientation,
    orientationMargin: $mergedProps.orientation_margin,
    plain: $mergedProps.plain,
    type: $mergedProps.type,
    ...$mergedProps.props,
    ...bindEvents($mergedProps),
    slots: $slots,
  };
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if $mergedProps.visible}
  {#await AwaitedDivider then Divider}
    {#if $mergedProps._internal.layout}
      <Divider {...passed_props}>
        <slot></slot>
      </Divider>
    {:else if $mergedProps.value}
      <Divider {...passed_props}>
        {$mergedProps.value}
      </Divider>
    {:else}
      <Divider {...passed_props} />
    {/if}
  {/await}
{/if}

<style>
</style>
