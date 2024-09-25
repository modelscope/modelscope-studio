<svelte:options accessors={true} />

<script lang="ts">
  import { bindEvents } from '@svelte-preprocess-react/component';
  import {
    getSlotContext,
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import { getSetSelectionItemFn, type Item } from '../../context';

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
    index?: number;
  } = {};

  export let as_item: string | undefined;
  export let text: string;
  export let built_in_selection: string | undefined;

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
    text,
    built_in_selection,
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
    text,
    built_in_selection,
    restProps: $$restProps,
  });
  const setSelectionItem = getSetSelectionItemFn();
  $: setSelectionItem<Item | string>(
    $slotKey,
    $mergedProps._internal.index || 0,
    $mergedProps.built_in_selection
      ? $mergedProps.built_in_selection
      : {
          props: {
            style: $mergedProps.elem_style,
            className: cls(
              $mergedProps.elem_classes,
              'ms-gr-antd-table-selection'
            ),
            id: $mergedProps.elem_id,
            text: $mergedProps.text,
            ...$mergedProps.restProps,
            ...$mergedProps.props,
            ...bindEvents($mergedProps),
          },
          slots: $slots,
        }
  );
</script>

{#if $mergedProps.visible}
  <slot></slot>
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
