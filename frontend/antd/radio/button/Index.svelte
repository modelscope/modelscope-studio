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

  const AwaitedRadioButton = importComponent(() => import('./radio.button'));

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};
  export let value: boolean;
  export let group_value: any;
  export let auto_focus: boolean;
  export let default_checked: boolean;
  export let disabled: boolean;
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
    auto_focus,
    group_value,
    default_checked,
    disabled,
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
    auto_focus,
    group_value,
    default_checked,
    disabled,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedRadioButton then RadioButton}
    <RadioButton
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-radio-button')}
      id={$mergedProps.elem_id}
      checked={$mergedProps.value}
      value={$mergedProps.group_value}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      onValueChange={(v) => {
        value = v;
      }}
    >
      <slot />
    </RadioButton>
  {/await}
{/if}

<style>
</style>
