<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedTimePickerRangePicker = importComponent(
    () => import('./time-picker.range-picker')
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
    restProps: $$restProps,
  });
  const setSlotParams = getSetSlotParamsFn();
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
    restProps: $$restProps,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedTimePickerRangePicker then TimeRangePicker}
    <TimeRangePicker
      style={$mergedProps.elem_style}
      className={cls(
        $mergedProps.elem_classes,
        'ms-gr-antd-time-picker-range-picker'
      )}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        calendar_change: 'calendarChange',
      })}
      slots={$slots}
      value={$mergedProps.props.value || $mergedProps.value}
      onValueChange={(val) => {
        value = val;
      }}
      {setSlotParams}
    >
      <slot />
    </TimeRangePicker>
  {/await}
{/if}
