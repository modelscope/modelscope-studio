<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlotKey } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedCol = importComponent(() => import('./col'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;

    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
      index?: number;
    };
  }>(() => props);

  const slotKey = getSlotKey();

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

  let slot = $state<HTMLElement>();
</script>

{#await AwaitedCol then Col}
  <Col
    style={proceedProps.elem_style}
    className={cls(proceedProps.elem_classes, 'ms-gr-antd-col')}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
    itemElement={slot}
    slots={{}}
  >
    {#if proceedProps.visible}
      <svelte-slot bind:this={slot}>
        {@render children?.()}
      </svelte-slot>
    {/if}
  </Col>
{/await}

<style>
  svelte-slot {
    display: none;
  }
</style>
