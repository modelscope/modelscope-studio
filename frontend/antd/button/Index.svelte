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
  export let value = '';
  export let auto_insert_space;
  export let block;
  export let class_names;
  export let danger;
  export let disabled;
  export let ghost;
  export let href;
  export let html_type;
  export let icon;
  export let icon_position;
  export let loading;
  export let shape;
  export let size;
  export let styles;
  export let href_target;
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
    auto_insert_space,
    block,
    class_names,
    danger,
    disabled,
    ghost,
    href,
    html_type,
    icon,
    icon_position,
    loading,
    shape,
    size,
    styles,
    href_target,
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
    auto_insert_space,
    block,
    class_names,
    danger,
    disabled,
    ghost,
    href,
    html_type,
    icon,
    icon_position,
    loading,
    shape,
    size,
    styles,
    href_target,
    type,
  });
</script>

<!-- $$slots.default and slot fallbacks are not working in gradio -->
{#if $mergedProps.visible}
  {#await AwaitedButton then Button}
    <Button
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-button')}
      id={$mergedProps.elem_id}
      autoInsertSpace={$mergedProps.auto_insert_space}
      block={$mergedProps.block}
      classNames={$mergedProps.class_names}
      danger={$mergedProps.danger}
      disabled={$mergedProps.disabled}
      ghost={$mergedProps.ghost}
      href={$mergedProps.href}
      htmlType={$mergedProps.html_type}
      icon={$mergedProps.icon}
      iconPosition={$mergedProps.icon_position}
      loading={$mergedProps.loading}
      shape={$mergedProps.shape}
      size={$mergedProps.size}
      styles={$mergedProps.styles}
      target={$mergedProps.href_target}
      type={$mergedProps.type}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
    >
      {#if $mergedProps._internal.layout}
        <slot></slot>
      {:else}
        {$mergedProps.value}
      {/if}
    </Button>
  {/await}
{/if}

<style>
</style>
