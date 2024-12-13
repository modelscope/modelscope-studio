<svelte:options accessors={true} />

<script lang="ts">
  import { bindEvents } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlotKey,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import { createFunction } from '@utils/createFunction';
  import { renderItems } from '@utils/renderItems';
  import { renderParamsSlot } from '@utils/renderParamsSlot';
  import { renderSlot } from '@utils/renderSlot';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import { getItems as getMenuItems } from '../../menu/context';
  import { getSetColumnItemFn, type Item } from '../context';

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
  const { 'filterDropdownProps.menu.items': dropdownMenuItems } = getMenuItems([
    'filterDropdownProps.menu.items',
  ]);
  const setColumnItem = getSetColumnItemFn();
  const setSlotParams = getSetSlotParamsFn();
  $: {
    const showSorterTooltip =
      $mergedProps.props.showSorterTooltip ||
      $mergedProps.restProps.showSorterTooltip;
    const sorter = $mergedProps.props.sorter || $mergedProps.restProps.sorter;

    const filterDropdownMenu = {
      ...($mergedProps.restProps.filterDropdownProps?.menu || {}),
      ...($mergedProps.props.filterDropdownProps?.menu || {}),
      items:
        $mergedProps.props.filterDropdownProps?.menu?.items ||
        $mergedProps.restProps.filterDropdownProps?.menu?.items ||
        $dropdownMenuItems.length > 0
          ? renderItems($dropdownMenuItems, { clone: true })
          : undefined,
      expandIcon:
        renderParamsSlot(
          {
            setSlotParams,
            slots: $slots,
            key: 'filterDropdownProps.menu.expandIcon',
          },
          {
            clone: true,
          }
        ) ||
        $mergedProps.props.filterDropdownProps?.menu?.expandIcon ||
        $mergedProps.restProps.filterDropdownProps?.menu?.expandIcon,
      overflowedIndicator:
        renderSlot($slots['filterDropdownProps.menu.overflowedIndicator']) ||
        $mergedProps.props.filterDropdownProps?.menu?.overflowedIndicator ||
        $mergedProps.restProps.filterDropdownProps?.menu?.overflowedIndicator,
    };

    const filterDropdownProps = {
      ...($mergedProps.restProps.filterDropdownProps || {}),
      ...($mergedProps.props.filterDropdownProps || {}),
      dropdownRender: $slots['filterDropdownProps.dropdownRender']
        ? renderParamsSlot(
            {
              setSlotParams,
              slots: $slots,
              key: 'filterDropdownProps.dropdownRender',
            },
            {
              clone: true,
            }
          )
        : createFunction(
            $mergedProps.props.filterDropdownProps?.dropdownRender ||
              $mergedProps.restProps.filterDropdownProps?.dropdownRender
          ),
      menu:
        Object.values(filterDropdownMenu).filter(Boolean).length > 0
          ? filterDropdownMenu
          : undefined,
    };

    setColumnItem<Item | string>(
      $slotKey,
      $mergedProps._internal.index || 0,
      built_in_column
        ? built_in_column
        : {
            props: {
              style: $mergedProps.elem_style,
              className: cls(
                $mergedProps.elem_classes,
                'ms-gr-antd-table-column'
              ),
              id: $mergedProps.elem_id,
              ...$mergedProps.restProps,
              ...$mergedProps.props,
              ...bindEvents($mergedProps, {
                filter_dropdown_open_change: 'filterDropdownOpenChange',
              }),
              render: createFunction(
                $mergedProps.props.render || $mergedProps.restProps.render
              ),
              filterDropdownProps:
                Object.values(filterDropdownProps).filter(Boolean).length > 0
                  ? filterDropdownProps
                  : undefined,
              filterIcon: createFunction(
                $mergedProps.props.filterIcon ||
                  $mergedProps.restProps.filterIcon
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
              onFilter: createFunction(
                $mergedProps.props.onFilter || $mergedProps.restProps.onFilter
              ),
              onHeaderCell: createFunction(
                $mergedProps.props.onHeaderCell ||
                  $mergedProps.restProps.onHeaderCell
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
          }
    );
  }
</script>

{#if $mergedProps.visible}
  <slot></slot>
{/if}

<style>
  :global(.ms-gr-antd-noop-class) {
    display: none;
  }
</style>
