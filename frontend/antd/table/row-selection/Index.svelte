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
  import { createFunction } from '@utils/createFunction';
  import cls from 'classnames';

  const AwaitedRowSelection = importComponent(
    () => import('./table.row-selection')
  );

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
      index?: number;
    };
    onCell?: string;
    getCheckboxProps?: string;
    getTitleCheckboxProps?: string;
    renderCell?: string;
    columnTitle?: string;
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

  const itemProps = $derived({
    props: {
      style: proceedProps.elem_style,
      className: cls(
        proceedProps.elem_classes,
        'ms-gr-antd-table-row-selection'
      ),
      id: proceedProps.elem_id,
      ...proceedProps.restProps,
      ...proceedProps.additionalProps,
      onCell: createFunction(
        proceedProps.additionalProps.onCell || proceedProps.restProps.onCell
      ),
      getCheckboxProps: createFunction(
        proceedProps.additionalProps.getCheckboxProps ||
          proceedProps.restProps.getCheckboxProps
      ),
      getTitleCheckboxProps: createFunction(
        proceedProps.additionalProps.getTitleCheckboxProps ||
          proceedProps.restProps.getTitleCheckboxProps
      ),
      renderCell: createFunction(
        proceedProps.additionalProps.renderCell ||
          proceedProps.restProps.renderCell
      ),
      columnTitle:
        proceedProps.additionalProps.columnTitle ||
        proceedProps.restProps.columnTitle,
    },
    slots: {
      ...slots.value,
      selections: undefined,
      columnTitle: {
        el: slots.value.columnTitle,
        withParams: true,
        clone: true,
      },
      renderCell: {
        el: slots.value.renderCell,
        withParams: true,
        clone: true,
      },
    },
  });
</script>

{#await AwaitedRowSelection then RowSelection}
  <RowSelection
    {...itemProps.props}
    slots={itemProps.slots}
    itemSlotKey={slotKey?.value}
    itemIndex={proceedProps._internal.index || 0}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </RowSelection>
{/await}
