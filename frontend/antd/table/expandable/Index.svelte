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

  const AwaitedExpandable = importComponent(() => import('./table.expandable'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {
      layout?: boolean;
      index?: number;
    };
    expanded_rows_change?: any;
    expanded_row_class_name?: string;
    expanded_row_render?: string;
    row_expandable?: string;
    expand_icon?: string;
    column_title?: string;
  }>(() => props);
  const slotKey = getSlotKey();

  const getProceedProps = processProps(
    () => {
      const {
        visible,
        _internal,
        as_item,
        elem_classes,
        elem_id,
        elem_style,
        row_expandable,
        expand_icon,
        expanded_row_class_name,
        expanded_row_render,
        column_title,
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
        rowExpandable: row_expandable,
        expandIcon: expand_icon,
        expandedRowClassName: expanded_row_class_name,
        expandedRowRender: expanded_row_render,
        columnTitle: column_title,
      };
    },
    {
      expanded_rows_change: 'expandedRowsChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
  const itemProps = $derived({
    props: {
      style: proceedProps.elem_style,
      className: cls(proceedProps.elem_classes, 'ms-gr-antd-table-expandable'),
      id: proceedProps.elem_id,
      ...proceedProps.restProps,
      ...proceedProps.additionalProps,
      expandedRowClassName: createFunction(
        proceedProps.additionalProps.expandedRowClassName ||
          proceedProps.expandedRowClassName,
        true
      ),
      expandedRowRender: createFunction(
        proceedProps.additionalProps.expandedRowRender ||
          proceedProps.expandedRowRender
      ),
      rowExpandable: createFunction(
        proceedProps.additionalProps.rowExpandable || proceedProps.rowExpandable
      ),
      expandIcon: createFunction(
        proceedProps.additionalProps.expandIcon || proceedProps.expandIcon
      ),
      columnTitle:
        proceedProps.additionalProps.columnTitle || proceedProps.columnTitle,
    },
    slots: {
      ...slots.value,
      expandIcon: {
        el: slots.value['expandIcon'],
        withParams: true,
        clone: true,
      },
      expandedRowRender: {
        el: slots.value['expandedRowRender'],
        withParams: true,
        clone: true,
      },
    },
  });
</script>

{#await AwaitedExpandable then Expandable}
  <Expandable
    {...itemProps.props}
    slots={itemProps.slots}
    itemSlotKey={slotKey?.value}
    itemIndex={proceedProps._internal.index || 0}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </Expandable>
{/await}
