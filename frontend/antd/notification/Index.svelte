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

  const AwaitedNotification = importComponent(() => import('./notification'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let message = '';
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
    message,
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
    message,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    restProps: $$restProps,
  });
</script>

{#await AwaitedNotification then Notification}
  <Notification
    style={$mergedProps.elem_style}
    className={cls($mergedProps.elem_classes, 'ms-gr-antd-notification')}
    id={$mergedProps.elem_id}
    {...$mergedProps.restProps}
    {...$mergedProps.props}
    {...bindEvents($mergedProps)}
    message={$mergedProps.props.message || $mergedProps.message}
    notificationKey={$mergedProps.props.key || $mergedProps.restProps.key}
    slots={$slots}
    visible={$mergedProps.visible}
    onVisible={(v) => {
      visible = v;
    }}
  >
    <slot></slot>
  </Notification>
{/await}

<style>
</style>
