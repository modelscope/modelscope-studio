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

  const AwaitedMentionsOption = importComponent(
    () => import('./mentions.option')
  );
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
    index?: number;
  } = {};
  export let value: string | undefined;
  export let label: string | undefined;
  export let disabled: boolean | undefined;
  export let key: string | undefined;
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
    value,
    disabled,
    key,
    label,
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
    disabled,
    key,
    label,
    restProps: $$restProps,
  });

  $: itemProps = {
    props: {
      style: $mergedProps.elem_style,
      className: cls($mergedProps.elem_classes, 'ms-gr-antd-mentions-option'),
      id: $mergedProps.elem_id,
      value: $mergedProps.value,
      label: $mergedProps.label,
      disabled: $mergedProps.disabled,
      key: $mergedProps.key,
      ...$mergedProps.restProps,
      ...$mergedProps.props,
      ...bindEvents($mergedProps),
    },
    slots: $slots,
  };
</script>

{#await AwaitedMentionsOption then MentionsOption}
  <MentionsOption
    {...itemProps.props}
    slots={itemProps.slots}
    itemIndex={$mergedProps._internal.index || 0}
    itemSlotKey={$slotKey}
  >
    {#if $mergedProps.visible}
      <slot></slot>
    {/if}
  </MentionsOption>
{/await}
