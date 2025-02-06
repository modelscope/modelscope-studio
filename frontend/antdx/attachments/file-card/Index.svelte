<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlots } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Attachment } from '@ant-design/x/es/attachments';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedAttachmentsFileCard = importComponent(
    () => import('./attachments.file-card')
  );
  export let item: Attachment;
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

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
    item,
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
    item,
    restProps: $$restProps,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedAttachmentsFileCard then AttachmentsFileCard}
    <AttachmentsFileCard
      style={$mergedProps.elem_style}
      className={cls(
        $mergedProps.elem_classes,
        'ms-gr-antdx-attachments-file-card'
      )}
      id={$mergedProps.elem_id}
      item={$mergedProps.item}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
    >
      <slot></slot>
    </AttachmentsFileCard>
  {/await}
{/if}
