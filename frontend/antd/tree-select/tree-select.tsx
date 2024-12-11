import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, TreeSelect as ATreeSelect } from 'antd';

import { type Item } from './context';

type TreeSelectProps = GetProps<typeof ATreeSelect>;

export const TreeSelect = sveltify<
  TreeSelectProps & {
    slotItems: Item[];
    onValueChange: (options: string | string[]) => void;
    onLoadData?: (...args: any[]) => Promise<unknown>;
    setSlotParams: SetSlotParams;
  },
  [
    'allowClear.clearIcon',
    'maxTagPlaceholder',
    'notFoundContent',
    'suffixIcon',
    'prefix',
    'switcherIcon',
    'dropdownRender',
    'tagRender',
    'treeTitleRender',
  ]
>(
  ({
    slots,
    filterTreeNode,
    getPopupContainer,
    dropdownRender,
    tagRender,
    treeTitleRender,
    treeData,
    onValueChange,
    onChange,
    children,
    slotItems,
    maxTagPlaceholder,
    elRef,
    setSlotParams,
    onLoadData,
    ...props
  }) => {
    const filterTreeNodeFunction = useFunction(filterTreeNode);
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const tagRenderFunction = useFunction(tagRender);
    const dropdownRenderFunction = useFunction(dropdownRender);
    const treeTitleRenderFunction = useFunction(treeTitleRender);

    const componentProps: TreeSelectProps = useMemo(() => {
      return {
        ...props,
        loadData: onLoadData,
        treeData:
          treeData ||
          renderItems<NonNullable<TreeSelectProps['treeData']>[number]>(
            slotItems,
            { clone: true }
          ),
        dropdownRender: slots.dropdownRender
          ? renderParamsSlot({ slots, setSlotParams, key: 'dropdownRender' })
          : dropdownRenderFunction,
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
        prefix: slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix,
        switcherIcon: slots.switcherIcon
          ? renderParamsSlot({ slots, setSlotParams, key: 'switcherIcon' })
          : props.switcherIcon,
        getPopupContainer: getPopupContainerFunction,
        tagRender: slots.tagRender
          ? renderParamsSlot({ slots, setSlotParams, key: 'tagRender' })
          : tagRenderFunction,
        treeTitleRender: slots.treeTitleRender
          ? renderParamsSlot({ slots, setSlotParams, key: 'treeTitleRender' })
          : treeTitleRenderFunction,
        filterTreeNode: filterTreeNodeFunction || filterTreeNode,
        maxTagPlaceholder: slots.maxTagPlaceholder
          ? renderParamsSlot({
              slots,
              setSlotParams,
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
      filterTreeNode,
      filterTreeNodeFunction,
      getPopupContainerFunction,
      maxTagPlaceholder,
      onLoadData,
      props,
      setSlotParams,
      slotItems,
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
            onChange?.(v, ...args);
            onValueChange(v as string | string[]);
          }}
        />
      </>
    );
  }
);
export default TreeSelect;
