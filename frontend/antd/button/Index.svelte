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

  const AwaitedButton = importComponent(() => import('./button'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};
  export let value: string | undefined;

  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  const [mergedProps, update] = getSlotContext(
    {
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
    },
    {
      href_target: 'target',
    }
  );

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
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if $mergedProps.visible}
  {#await AwaitedButton then Button}
    <Button
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-button')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      value={$mergedProps.value}
    >
      <slot></slot>
    </Button>
  {/await}
{/if}

<style>
</style>
