import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Table as ATable } from 'antd';

import type { Item } from './context';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

type TableProps = GetProps<typeof ATable>;
export const Table = sveltify<
  TableProps & {
    rowSelectionItems: Item[];
    expandableItems: Item[];
    columnItems: Item[];
    setSlotParams: SetSlotParams;
  },
  [
    'footer',
    'title',
    'loading.tip',
    'loading.indicator',
    'pagination.showQuickJumper.goButton',
    'pagination.itemRender',
    'showSorterTooltip.title',
    'summary',
  ]
>(
  ({
    children,
    slots,
    columnItems,
    columns,
    getPopupContainer,
    pagination,
    loading,
    rowKey,
    summary,
    rowSelection,
    rowSelectionItems,
    expandableItems,
    expandable,
    sticky,
    showSorterTooltip,
    onRow,
    onHeaderRow,
    setSlotParams,
    ...props
  }) => {
    const getPopupContainerFunction = useFunction(getPopupContainer);

    const supportLoadingConfig =
      slots['loading.tip'] || slots['loading.indicator'];
    const loadingConfig = getConfig(loading);
    const supportPaginationConfig =
      slots['pagination.showQuickJumper.goButton'] ||
      slots['pagination.itemRender'];
    const paginationConfig = getConfig(pagination);
    const paginationShowTotalFunction = useFunction(paginationConfig.showTotal);
    const rowKeyFunction = useFunction(rowKey);
    const supportShowSorterTooltipConfig =
      slots['showSorterTooltip.title'] || typeof showSorterTooltip === 'object';
    const showSorterTooltipConfig = getConfig(showSorterTooltip);
    const showSorterTooltipAfterOpenChangeFunction = useFunction(
      showSorterTooltipConfig.afterOpenChange
    );
    const showSorterTooltipGetPopupContainerFunction = useFunction(
      showSorterTooltipConfig.getPopupContainer
    );
    const supportStickyConfig = typeof sticky === 'object';
    const stickyConfig = getConfig(sticky);
    const stickyGetContainerFunction = useFunction(stickyConfig.getContainer);
    const onRowFunction = useFunction(onRow);
    const onHeaderRowFunction = useFunction(onHeaderRow);
    const summaryFunction = useFunction(summary);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ATable
          {...props}
          columns={useMemo(() => {
            return (
              columns?.map((item) => {
                if ((item as any) === 'EXPAND_COLUMN') {
                  return ATable.EXPAND_COLUMN;
                } else if ((item as any) === 'SELECTION_COLUMN') {
                  return ATable.SELECTION_COLUMN;
                }
                return item;
              }) ||
              renderItems<NonNullable<TableProps['columns']>[number]>(
                columnItems,
                {
                  fallback: (item) => {
                    if (item === 'EXPAND_COLUMN') {
                      return ATable.EXPAND_COLUMN;
                    } else if (item === 'SELECTION_COLUMN') {
                      return ATable.SELECTION_COLUMN;
                    }
                    return item;
                  },
                }
              )
            );
          }, [columnItems, columns])}
          onRow={onRowFunction}
          onHeaderRow={onHeaderRowFunction}
          summary={
            slots.summary
              ? renderParamsSlot({ slots, setSlotParams, key: 'summary' })
              : summaryFunction
          }
          rowSelection={useMemo(() => {
            return (
              rowSelection ||
              renderItems<TableProps['rowSelection']>(rowSelectionItems)[0]
            );
          }, [rowSelection, rowSelectionItems])}
          expandable={useMemo(() => {
            return (
              expandable ||
              renderItems<TableProps['expandable']>(expandableItems)[0]
            );
          }, [expandable, expandableItems])}
          rowKey={rowKeyFunction || rowKey}
          sticky={
            supportStickyConfig
              ? {
                  ...stickyConfig,
                  getContainer: stickyGetContainerFunction,
                }
              : sticky
          }
          showSorterTooltip={
            supportShowSorterTooltipConfig
              ? {
                  ...showSorterTooltipConfig,
                  afterOpenChange: showSorterTooltipAfterOpenChangeFunction,
                  getPopupContainer: showSorterTooltipGetPopupContainerFunction,
                  title: slots['showSorterTooltip.title'] ? (
                    <ReactSlot slot={slots['showSorterTooltip.title']} />
                  ) : (
                    showSorterTooltipConfig.title
                  ),
                }
              : showSorterTooltip
          }
          pagination={
            supportPaginationConfig
              ? omitUndefinedProps({
                  ...paginationConfig,
                  showTotal: paginationShowTotalFunction,
                  showQuickJumper: slots['pagination.showQuickJumper.goButton']
                    ? {
                        goButton: (
                          <ReactSlot
                            slot={slots['pagination.showQuickJumper.goButton']}
                          />
                        ),
                      }
                    : paginationConfig.showQuickJumper,
                  itemRender: slots['pagination.itemRender']
                    ? renderParamsSlot({
                        slots,
                        setSlotParams,
                        key: 'pagination.itemRender',
                      })
                    : paginationConfig.itemRender,
                })
              : pagination
          }
          getPopupContainer={getPopupContainerFunction}
          loading={
            supportLoadingConfig
              ? {
                  ...loadingConfig,
                  tip: slots['loading.tip'] ? (
                    <ReactSlot slot={slots['loading.tip']} />
                  ) : (
                    loadingConfig.tip
                  ),
                  indicator: slots['loading.indicator'] ? (
                    <ReactSlot slot={slots['loading.indicator']} />
                  ) : (
                    loadingConfig.indicator
                  ),
                }
              : loading
          }
          footer={
            slots.footer
              ? renderParamsSlot({ slots, setSlotParams, key: 'footer' })
              : props.footer
          }
          title={
            slots.title
              ? renderParamsSlot({ slots, setSlotParams, key: 'title' })
              : props.title
          }
        />
      </>
    );
  }
);

export default Table;
