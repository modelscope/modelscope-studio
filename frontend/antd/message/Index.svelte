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

  const AwaitedMessage = importComponent(() => import('./message'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let content = '';
  export let as_item: string | undefined;
  // gradio properties
  export let visible = false;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    content,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
  });

  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    content,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
  });
</script>

{#await AwaitedMessage then Message}
  <Message
    style={$mergedProps.elem_style}
    className={cls($mergedProps.elem_classes, 'ms-gr-antd-message')}
    id={$mergedProps.elem_id}
    {...$mergedProps.props}
    {...bindEvents($mergedProps)}
    content={$mergedProps.props.content || $mergedProps.content}
    slots={$slots}
    visible={$mergedProps.visible}
    onVisible={(v) => {
      visible = v;
    }}
  >
    <slot></slot>
  </Message>
{/await}

<style>
</style>
