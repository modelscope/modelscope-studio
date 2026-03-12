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

  const AwaitedBreadcrumbItem = importComponent(
    () => import('./breadcrumb.item')
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

  const slots = getSlots();
</script>

{#await AwaitedBreadcrumbItem then BreadcrumbItem}
  <BreadcrumbItem
    style={proceedProps.elem_style}
    className={cls(proceedProps.elem_classes, 'ms-gr-antd-breadcrumb-item')}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    slots={{}}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
    itemSlots={slots.value}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </BreadcrumbItem>
{/await}
