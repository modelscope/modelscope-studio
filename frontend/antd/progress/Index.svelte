<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedProgress = importComponent(() => import('./progress'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps } = getProps<{
    additional_props?: Record<string, any>;

    _internal: {
      layout?: boolean;
    };
    percent?: number;
  }>(() => props);

  const getProceedProps = processProps(() => {
    const {
      visible,
      _internal,
      as_item,
      elem_classes,
      elem_id,
      elem_style,
      percent,
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
      percent,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedProgress then Progress}
    <Progress
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-progress')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      percent={proceedProps.additionalProps.percent ?? proceedProps.percent}
    />
  {/await}
{/if}
