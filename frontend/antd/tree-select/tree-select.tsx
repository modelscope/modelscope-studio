import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, TreeSelect as ATreeSelect } from 'antd';

import { useItems, withItemsContextProvider } from './context';

type TreeSelectProps = GetProps<typeof ATreeSelect>;

export const TreeSelect = sveltify<
  TreeSelectProps & {
    onValueChange: (options: string | string[]) => void;
    onLoadData?: (...args: any[]) => Promise<unknown>;
  },
  [
    'allowClear.clearIcon',
    'maxTagPlaceholder',
    'notFoundContent',
    'suffixIcon',
    'prefix',
    'switcherIcon',
    'dropdownRender',
    'popupRender',
    'tagRender',
    'treeTitleRender',
  ]
>(
  withItemsContextProvider(
    ['default', 'treeData'],
    ({
      slots,
      filterTreeNode,
      getPopupContainer,
      dropdownRender,
      popupRender,
      tagRender,
      treeTitleRender,
      treeData,
      onValueChange,
      onChange,
      children,
      maxTagPlaceholder,
      elRef,
      onLoadData,
      ...props
    }) => {
      const filterTreeNodeFunction = useFunction(filterTreeNode);
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const tagRenderFunction = useFunction(tagRender);
      const dropdownRenderFunction = useFunction(dropdownRender);
      const popupRenderFunction = useFunction(popupRender);
      const treeTitleRenderFunction = useFunction(treeTitleRender);
      const { items: slotItems } = useItems<['default', 'treeData']>();
      const resolvedSlotItems =
        slotItems.treeData.length > 0 ? slotItems.treeData : slotItems.default;
      const componentProps: TreeSelectProps = useMemo(() => {
        return {
          ...props,
          // eslint-disable-next-line require-await
          loadData: async (...args) => onLoadData?.(...args),
          treeData:
            treeData ||
            renderItems<NonNullable<TreeSelectProps['treeData']>[number]>(
              resolvedSlotItems,
              {
                clone: true,
                itemPropsTransformer: (itemProps) => {
                  if (
                    itemProps.value &&
                    itemProps.key &&
                    itemProps.value !== itemProps.key
                  ) {
                    return {
                      ...itemProps,
                      key: undefined,
                    };
                  }
                  return itemProps;
                },
              }
            ),
          dropdownRender: slots.dropdownRender
            ? renderParamsSlot({ slots, key: 'dropdownRender' })
            : dropdownRenderFunction,
          popupRender: slots.popupRender
            ? renderParamsSlot({ slots, key: 'popupRender' })
            : popupRenderFunction,
          allowClear: slots['allowClear.clearIcon']
            ? {
                clearIcon: <ReactSlot slot={slots['allowClear.clearIcon']} />,
              }
            : props.allowClear,
          suffixIcon: slots.suffixIcon ? (
            <ReactSlot slot={slots.suffixIcon} />
          ) : (
            props.suffixIcon
          ),
          prefix: slots.prefix ? (
            <ReactSlot slot={slots.prefix} />
          ) : (
            props.prefix
          ),
          switcherIcon: slots.switcherIcon
            ? renderParamsSlot({ slots, key: 'switcherIcon' })
            : props.switcherIcon,
          getPopupContainer: getPopupContainerFunction,
          tagRender: slots.tagRender
            ? renderParamsSlot({ slots, key: 'tagRender' })
            : tagRenderFunction,
          treeTitleRender: slots.treeTitleRender
            ? renderParamsSlot({ slots, key: 'treeTitleRender' })
            : treeTitleRenderFunction,
          filterTreeNode: filterTreeNodeFunction || filterTreeNode,
          maxTagPlaceholder: slots.maxTagPlaceholder
            ? renderParamsSlot({
                slots,
                key: 'maxTagPlaceholder',
              })
            : maxTagPlaceholder,
          notFoundContent: slots.notFoundContent ? (
            <ReactSlot slot={slots.notFoundContent} />
          ) : (
            props.notFoundContent
          ),
        };
      }, [
        dropdownRenderFunction,
        popupRenderFunction,
        filterTreeNode,
        filterTreeNodeFunction,
        getPopupContainerFunction,
        maxTagPlaceholder,
        onLoadData,
        props,
        resolvedSlotItems,
        slots,
        tagRenderFunction,
        treeData,
        treeTitleRenderFunction,
      ]);

      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ATreeSelect
            {...omitUndefinedProps(componentProps)}
            ref={elRef}
            onChange={(v, ...args) => {
              onValueChange(v as string | string[]);
              onChange?.(v, ...args);
            }}
          />
        </>
      );
    }
  )
);
export default TreeSelect;
