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
  import { type Writable, writable } from 'svelte/store';

  import { getItems } from '../tabs/context';

  const AwaitedCard = importComponent(() => import('./card'));
  export let gradio: Gradio;
  export let _internal: Record<string, any> = {};
  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  const updatedProps: Writable<typeof props> = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  export let visible = true;
  const setSlotParams = getSetSlotParamsFn();

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
    restProps: $$restProps,
  });

  const { tabList } = getItems(['tabList']);
</script>

{#if $mergedProps.visible}
  {#await AwaitedCard then Card}
    <Card
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-card')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        tab_change: 'tabChange',
      })}
      containsGrid={$mergedProps._internal.contains_grid}
      slots={$slots}
      tabListItems={$tabList}
      {setSlotParams}
    >
      <slot></slot>
    </Card>
  {/await}
{/if}

<style>
</style>
