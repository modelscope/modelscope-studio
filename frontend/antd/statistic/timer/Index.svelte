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
  import { type Writable, writable } from 'svelte/store';

  const AwaitedStatisticTimer = importComponent(
    () => import('./statistic.timer')
  );
  export let gradio: Gradio;
  export let _internal: Record<string, any> = {};
  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  export let value: number;
  const updatedProps: Writable<typeof props> = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
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
    value,
    restProps: $$restProps,
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
    value,
    restProps: $$restProps,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedStatisticTimer then StatisticTimer}
    <StatisticTimer
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-statistic-timer')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      type={$mergedProps.props.type ?? $mergedProps.restProps.type}
      slots={$slots}
      value={$mergedProps.props.value ?? $mergedProps.value}
    >
      <slot></slot>
    </StatisticTimer>
  {/await}
{/if}

<style>
</style>
