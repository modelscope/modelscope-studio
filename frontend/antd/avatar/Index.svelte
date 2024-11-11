<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlots } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { FileData } from '@gradio/client';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedAvatar = importComponent(() => import('./avatar'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let value: string | FileData = '';
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
    restProps: $$restProps,
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
    restProps: $$restProps,
  });
  let src = '';
  $: {
    if (typeof $mergedProps.value === 'object' && $mergedProps.value) {
      src = $mergedProps.value.url || '';
    } else {
      src = $mergedProps.value;
    }
  }
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if $mergedProps.visible}
  {#await AwaitedAvatar then Avatar}
    <Avatar
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-avatar')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      src={$mergedProps.props.src || src}
    >
      <slot></slot>
    </Avatar>
  {/await}
{/if}

<style>
</style>
