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

  import { getItems } from '../context';

  const AwaitedDatePickerRangePicker = importComponent(
    () => import('./date-picker.range-picker')
  );

  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let value: [string | number | null, string | number | null];
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
  });
  const { presets } = getItems(['presets']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedDatePickerRangePicker then DateRangePicker}
    <DateRangePicker
      style={$mergedProps.elem_style}
      className={cls(
        $mergedProps.elem_classes,
        'ms-gr-antd-date-picker-range-picker'
      )}
      id={$mergedProps.elem_id}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      slots={$slots}
      value={$mergedProps.props.value || $mergedProps.value}
      presetItems={$presets}
      onValueChange={(val) => {
        value = val;
      }}
    >
      <slot />
    </DateRangePicker>
  {/await}
{/if}
