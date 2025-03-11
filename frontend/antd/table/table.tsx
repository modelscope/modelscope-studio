import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { createFunction } from '@utils/createFunction';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Table as ATable } from 'antd';

import {
  useColumnItems,
  useExpandableItems,
  useRowSelectionItems,
  withColumnItemsContextProvider,
  withExpandableItemsContextProvider,
  withRowSelectionItemsContextProvider,
} from './context';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

type TableProps = GetProps<typeof ATable>;
export const Table = sveltify<
  TableProps & {
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
  withRowSelectionItemsContextProvider(
    ['rowSelection'],
    withExpandableItemsContextProvider(
      ['expandable'],
      withColumnItemsContextProvider(
        ['default'],
        ({
          children,
          slots,
          columns,
          getPopupContainer,
          pagination,
          loading,
          rowKey,
          rowClassName,
          summary,
          rowSelection,
          expandable,
          sticky,
          footer,
          showSorterTooltip,
          onRow,
          onHeaderRow,
          components,
          setSlotParams,
          ...props
        }) => {
          const {
            items: { default: columnItems },
          } = useColumnItems<['default']>();
          const {
            items: { expandable: expandableItems },
          } = useExpandableItems<['expandable']>();
          const {
            items: { rowSelection: rowSelectionItems },
          } = useRowSelectionItems<['rowSelection']>();
          const getPopupContainerFunction = useFunction(getPopupContainer);

          const supportLoadingConfig =
            slots['loading.tip'] || slots['loading.indicator'];
          const loadingConfig = getConfig(loading);
          const supportPaginationConfig =
            slots['pagination.showQuickJumper.goButton'] ||
            slots['pagination.itemRender'];
          const paginationConfig = getConfig(pagination);
          const paginationShowTotalFunction = useFunction(
            paginationConfig.showTotal
          );
          const rowClassNameFunction = useFunction(rowClassName);
          const rowKeyFunction = useFunction(rowKey, true);
          const supportShowSorterTooltipConfig =
            slots['showSorterTooltip.title'] ||
            typeof showSorterTooltip === 'object';
          const showSorterTooltipConfig = getConfig(showSorterTooltip);
          const showSorterTooltipAfterOpenChangeFunction = useFunction(
            showSorterTooltipConfig.afterOpenChange
          );
          const showSorterTooltipGetPopupContainerFunction = useFunction(
            showSorterTooltipConfig.getPopupContainer
          );
          const supportStickyConfig = typeof sticky === 'object';
          const stickyConfig = getConfig(sticky);
          const stickyGetContainerFunction = useFunction(
            stickyConfig.getContainer
          );
          const onRowFunction = useFunction(onRow);
          const onHeaderRowFunction = useFunction(onHeaderRow);
          const summaryFunction = useFunction(summary);
          const footerFunction = useFunction(footer);
          const customComponents = useMemo(() => {
            const headerTable = createFunction(components?.header?.table);
            const headerRow = createFunction(components?.header?.row);
            const headerCell = createFunction(components?.header?.cell);
            const headerWrapper = createFunction(components?.header?.wrapper);
            return {
              table: createFunction(components?.table),
              header:
                headerTable || headerRow || headerCell || headerWrapper
                  ? {
                      table: headerTable,
                      row: headerRow,
                      cell: headerCell,
                      wrapper: headerWrapper,
                    }
                  : undefined,
              body:
                typeof components?.body === 'object'
                  ? {
                      wrapper: createFunction(components?.body?.wrapper),
                      row: createFunction(components?.body?.row),
                      cell: createFunction(components?.body?.cell),
                    }
                  : createFunction(components?.body),
            };
          }, [components]);

          return (
            <>
              <div style={{ display: 'none' }}>{children}</div>
              <ATable
                {...props}
                components={customComponents}
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
                    renderItems<TableProps['rowSelection']>(
                      rowSelectionItems
                    )?.[0]
                  );
                }, [rowSelection, rowSelectionItems])}
                expandable={useMemo(() => {
                  return (
                    expandable ||
                    renderItems<TableProps['expandable']>(expandableItems)?.[0]
                  );
                }, [expandable, expandableItems])}
                rowClassName={rowClassNameFunction}
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
                        afterOpenChange:
                          showSorterTooltipAfterOpenChangeFunction,
                        getPopupContainer:
                          showSorterTooltipGetPopupContainerFunction,
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
                        showQuickJumper: slots[
                          'pagination.showQuickJumper.goButton'
                        ]
                          ? {
                              goButton: (
                                <ReactSlot
                                  slot={
                                    slots['pagination.showQuickJumper.goButton']
                                  }
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
                    : footerFunction
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
      )
    )
  )
);

export default Table;
