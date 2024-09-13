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

  const AwaitedCheckableTag = importComponent(
    () => import('./tag.checkable-tag')
  );

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let as_item: string | undefined;
  export let value: boolean = false;
  export let label = '';
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
    label,
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
    label,
  });
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if $mergedProps.visible}
  {#await AwaitedCheckableTag then CheckableTag}
    <CheckableTag
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-tag-checkable-tag')}
      id={$mergedProps.elem_id}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      checked={$mergedProps.props.checked ?? $mergedProps.value}
      onValueChange={(checked) => {
        value = checked;
      }}
    >
      {#if $mergedProps._internal.layout}
        <slot></slot>
      {:else}
        {$mergedProps.label}
      {/if}
    </CheckableTag>
  {/await}
{/if}

<style>
</style>
