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

  const AwaitedSelection = importComponent(
    () => import('./table.row-selection.selection')
  );

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
      index?: number;
    };
    built_in_selection?: string;
    text?: string;
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
      built_in_selection,
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
      built_in_selection,
    };
  });
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#await AwaitedSelection then Selection}
  <Selection
    style={proceedProps.elem_style}
    className={cls(
      proceedProps.elem_classes,
      'ms-gr-antd-table-row-selection-selection'
    )}
    id={proceedProps.elem_id}
    {...proceedProps.restProps}
    {...proceedProps.additionalProps}
    slots={slots.value}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
    itemBuiltIn={proceedProps.built_in_selection}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </Selection>
{/await}
