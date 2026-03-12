<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import {
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  const AwaitedDescriptionsItem = importComponent(
    () => import('./descriptions.item')
  );

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
  const slots = getSlots();
</script>

{#await AwaitedDescriptionsItem then DescriptionsItem}
  <DescriptionsItem
    style={proceedProps.elem_style}
    className={cls(proceedProps.elem_classes, 'ms-gr-antd-descriptions-item')}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    slots={{
      children: slot,
      ...slots.value,
    }}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
  >
    {#if proceedProps.visible}
      <svelte-slot bind:this={slot}>
        {@render children?.()}
      </svelte-slot>
    {/if}
  </DescriptionsItem>
{/await}

<style>
  svelte-slot {
    display: none;
  }
</style>
