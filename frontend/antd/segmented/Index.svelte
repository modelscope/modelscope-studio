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

  const AwaitedSegmented = importComponent(() => import('./segmented'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let value: number | string;
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
  const { options, default: children } = getItems(['options', 'default']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedSegmented then Segmented}
    <Segmented
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-segmented')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      value={$mergedProps.props.value ?? $mergedProps.value}
      slots={$slots}
      options={$mergedProps.props.options}
      slotItems={$options.length > 0 ? $options : $children}
      onValueChange={(v) => {
        value = v;
      }}
    >
      <slot />
    </Segmented>
  {/await}
{/if}
