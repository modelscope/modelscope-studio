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

  import type { TableColumnProps } from './table.column';

  const AwaitedTableColumn = importComponent(() => import('./table.column'));

  const props = $props();
  const { gradio, getComponentProps, getAdditionalProps, children } = getProps<{
    additional_props?: Record<string, any>;
    as_item?: string | undefined;
    _internal: {};
    filter_dropdown_open_change?: any;
    built_in_column?: string;
    column_render?: string;
    show_sorter_tooltip?: TableColumnProps['showSorterTooltip'];
    sorter?: TableColumnProps['sorter'];
    filter_search?: TableColumnProps['filterSearch'];
    should_cell_update?: TableColumnProps['shouldCellUpdate'];
    on_cell?: TableColumnProps['onCell'];
    on_filter?: TableColumnProps['onFilter'];
    on_header_cell?: TableColumnProps['onHeaderCell'];
    render?: TableColumnProps['render'];
    filter_icon?: TableColumnProps['filterIcon'];
    filter_dropdown?: TableColumnProps['filterDropdown'];
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
        built_in_column,
        show_sorter_tooltip,
        sorter,
        filter_search,
        should_cell_update,
        on_cell,
        on_filter,
        on_header_cell,
        render,
        filter_icon,
        filter_dropdown,
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
        built_in_column,
        showSorterTooltip: show_sorter_tooltip,
        sorter,
        filterSearch: filter_search,
        shouldCellUpdate: should_cell_update,
        onCell: on_cell,
        onFilter: on_filter,
        onHeaderCell: on_header_cell,
        render,
        filterIcon: filter_icon,
        filterDropdown: filter_dropdown,
      };
    },
    {
      column_render: 'render',
      filter_dropdown_open_change: 'filterDropdownOpenChange',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
  const itemProps = $derived.by(() => {
    {
      const showSorterTooltip =
        proceedProps.additionalProps.showSorterTooltip ||
        proceedProps.showSorterTooltip;
      const sorter = proceedProps.additionalProps.sorter || proceedProps.sorter;

      return {
        props: {
          style: proceedProps.elem_style,
          className: cls(proceedProps.elem_classes, 'ms-gr-antd-table-column'),
          id: proceedProps.elem_id,
          ...proceedProps.restProps,
          ...proceedProps.additionalProps,

          render: createFunction(
            proceedProps.additionalProps.render || proceedProps.render
          ),
          filterIcon: createFunction(
            proceedProps.additionalProps.filterIcon || proceedProps.filterIcon
          ),
          filterDropdown: createFunction(
            proceedProps.additionalProps.filterDropdown ||
              proceedProps.filterDropdown
          ),
          showSorterTooltip:
            typeof showSorterTooltip === 'object'
              ? {
                  ...showSorterTooltip,
                  afterOpenChange: createFunction(
                    typeof showSorterTooltip === 'object'
                      ? showSorterTooltip.afterOpenChange
                      : undefined
                  ),
                  getPopupContainer: createFunction(
                    typeof showSorterTooltip === 'object'
                      ? showSorterTooltip.getPopupContainer
                      : undefined
                  ),
                }
              : showSorterTooltip,
          sorter:
            typeof sorter === 'object'
              ? {
                  ...sorter,
                  compare: createFunction(sorter.compare) || sorter.compare,
                }
              : createFunction(sorter) || proceedProps.additionalProps.sorter,
          filterSearch:
            createFunction(
              proceedProps.additionalProps.filterSearch ||
                proceedProps.filterSearch
            ) ||
            proceedProps.additionalProps.filterSearch ||
            proceedProps.filterSearch,
          shouldCellUpdate: createFunction(
            proceedProps.additionalProps.shouldCellUpdate ||
              proceedProps.shouldCellUpdate
          ),
          onCell: createFunction(
            proceedProps.additionalProps.onCell || proceedProps.onCell
          ),
          // onFilter: createFunction(
          //   proceedProps.additionalProps.onFilter || proceedProps.restProps.onFilter
          // ),
          onHeaderCell: createFunction(
            proceedProps.additionalProps.onHeaderCell ||
              proceedProps.onHeaderCell
          ),
        },
        slots: {
          ...slots.value,
          filterIcon: {
            el: slots.value.filterIcon,
            withParams: true,
            clone: true,
          },
          filterDropdown: {
            el: slots.value.filterDropdown,
            withParams: true,
            clone: true,
          },
          sortIcon: {
            el: slots.value.sortIcon,
            withParams: true,
            clone: true,
          },
          title: {
            el: slots.value.title,
            withParams: true,
            clone: true,
          },
          render: {
            el: slots.value.render,
            withParams: true,
            clone: true,
          },
        },
      };
    }
  });
</script>

{#await AwaitedTableColumn then TableColumn}
  <TableColumn
    {...itemProps.props}
    slots={itemProps.slots}
    itemIndex={proceedProps._internal.index || 0}
    itemSlotKey={slotKey?.value}
    itemSlots={slots.value}
    itemBuiltIn={proceedProps.built_in_column}
  >
    {#if proceedProps.visible}
      {@render children?.()}
    {/if}
  </TableColumn>
{/await}
