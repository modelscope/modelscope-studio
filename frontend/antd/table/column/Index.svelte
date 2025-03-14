<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import { createFunction } from '@utils/createFunction';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  const AwaitedTableColumn = importComponent(() => import('./table.column'));
  export let gradio: Gradio;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: Record<string, any> = {};
  export let as_item: string | undefined;
  export let built_in_column: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  const slotKey = getSlotKey();

  const [mergedProps, update] = getSlotContext(
    {
      gradio,
      props: $updatedProps,
      _internal,
      visible,
      elem_id,
      elem_classes,
      elem_style,
      as_item,
      restProps: $$restProps,
    },
    {
      column_render: 'render',
    }
  );

  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    restProps: $$restProps,
  });

  const setSlotParams = getSetSlotParamsFn();
  let itemProps = {
    props: {},
    slots: {},
  };
  $: {
    const showSorterTooltip =
      $mergedProps.props.showSorterTooltip ||
      $mergedProps.restProps.showSorterTooltip;
    const sorter = $mergedProps.props.sorter || $mergedProps.restProps.sorter;

    itemProps = {
      props: {
        style: $mergedProps.elem_style,
        className: cls($mergedProps.elem_classes, 'ms-gr-antd-table-column'),
        id: $mergedProps.elem_id,
        ...$mergedProps.restProps,
        ...$mergedProps.props,
        ...bindEvents($mergedProps, {
          filter_dropdown_open_change: 'filterDropdownOpenChange',
        }),
        render: createFunction(
          $mergedProps.props.render || $mergedProps.restProps.render
        ),
        filterIcon: createFunction(
          $mergedProps.props.filterIcon || $mergedProps.restProps.filterIcon
        ),
        filterDropdown: createFunction(
          $mergedProps.props.filterDropdown ||
            $mergedProps.restProps.filterDropdown
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
            : createFunction(sorter) || $mergedProps.props.sorter,
        filterSearch:
          createFunction(
            $mergedProps.props.filterSearch ||
              $mergedProps.restProps.filterSearch
          ) ||
          $mergedProps.props.filterSearch ||
          $mergedProps.restProps.filterSearch,
        shouldCellUpdate: createFunction(
          $mergedProps.props.shouldCellUpdate ||
            $mergedProps.restProps.shouldCellUpdate
        ),
        onCell: createFunction(
          $mergedProps.props.onCell || $mergedProps.restProps.onCell
        ),
        // onFilter: createFunction(
        //   $mergedProps.props.onFilter || $mergedProps.restProps.onFilter
        // ),
        onHeaderCell: createFunction(
          $mergedProps.props.onHeaderCell || $mergedProps.restProps.onHeaderCell
        ),
      },
      slots: {
        ...$slots,
        filterIcon: {
          el: $slots.filterIcon,
          callback: setSlotParams,
          clone: true,
        },
        filterDropdown: {
          el: $slots.filterDropdown,
          callback: setSlotParams,
          clone: true,
        },
        sortIcon: {
          el: $slots.sortIcon,
          callback: setSlotParams,
          clone: true,
        },
        title: {
          el: $slots.title,
          callback: setSlotParams,
          clone: true,
        },
        render: {
          el: $slots.render,
          callback: setSlotParams,
          clone: true,
        },
      },
    };
  }
</script>

{#await AwaitedTableColumn then TableColumn}
  <TableColumn
    {...itemProps.props}
    slots={itemProps.slots}
    {setSlotParams}
    itemSlotKey={$slotKey}
    itemIndex={$mergedProps._internal.index || 0}
    itemSlots={$slots}
    itemBuiltIn={built_in_column}
  >
    {#if $mergedProps.visible}
      <slot></slot>
    {/if}
  </TableColumn>
{/await}
