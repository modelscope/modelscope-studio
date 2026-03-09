<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  import type StatisticTimer from './statistic.timer';

  const AwaitedTimer = importComponent(() => import('./statistic.timer'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {};
    value?: number;
    type?: StatisticTimer['type'];
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      ...restProps
    } = getComponentProps();
    return {
      gradio,
      additionalProps: getAdditionalProps(),
      _internal,
      as_item,
      restProps,
      visible,
      elem_id,
      elem_classes,
      elem_style,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();

  const type = $derived(
    proceedProps.additionalProps.type ??
      proceedProps.restProps.type ??
      'countdown'
  );
</script>

{#if proceedProps.visible}
  {#await AwaitedTimer then Timer}
    <Timer
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-statistic-timer')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      {type}
      slots={slots.value}
    >
      {@render children?.()}
    </Timer>
  {/await}
{/if}
