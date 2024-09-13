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

  const AwaitedCardMeta = importComponent(() => import('./card.meta'));
  export let gradio: Gradio;
  export let _internal: Record<string, any> = {};
  export let avatar;
  export let description;
  export let title;
  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));

  // gradio properties
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  export let visible = true;

  const slots = getSlots();
  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    avatar,
    description,
    title,
  });
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    avatar,
    description,
    title,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedCardMeta then CardMeta}
    <CardMeta
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-card-meta')}
      id={$mergedProps.elem_id}
      avatar={$mergedProps.avatar}
      description={$mergedProps.description}
      title={$mergedProps.title}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
    >
      <slot></slot>
    </CardMeta>
  {/await}
{/if}

<style>
</style>
