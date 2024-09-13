import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import { type GetProps, TreeSelect as ATreeSelect } from 'antd';

import { type Item } from './context';

type TreeSelectProps = GetProps<typeof ATreeSelect>;

export const TreeSelect = sveltify<
  TreeSelectProps & {
    slotItems: Item[];
    onValueChange: (options: string | string[]) => void;
  },
  [
    'allowClear.clearIcon',
    'maxTagPlaceholder',
    'notFoundContent',
    'suffixIcon',
    'switcherIcon',
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
    ...props
  }) => {
    const filterTreeNodeFunction = useFunction(filterTreeNode);
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const maxTagPlaceholderFunction = useFunction(maxTagPlaceholder);
    const tagRenderFunction = useFunction(tagRender);
    const dropdownRenderFunction = useFunction(dropdownRender);
    const treeTitleRenderFunction = useFunction(treeTitleRender);

    const componentProps: TreeSelectProps = useMemo(() => {
      return {
        ...props,
        treeData:
          treeData ||
          renderItems<NonNullable<TreeSelectProps['treeData']>[number]>(
            slotItems
          ),
        dropdownRender: dropdownRenderFunction,
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
        switcherIcon: slots.switcherIcon ? (
          <ReactSlot slot={slots.switcherIcon} />
        ) : (
          props.switcherIcon
        ),
        getPopupContainer: getPopupContainerFunction,
        tagRender: tagRenderFunction,
        treeTitleRender: treeTitleRenderFunction,
        filterTreeNode: filterTreeNodeFunction || filterTreeNode,
        maxTagPlaceholder:
          maxTagPlaceholderFunction ||
          (slots.maxTagPlaceholder ? (
            <ReactSlot slot={slots.maxTagPlaceholder} />
          ) : (
            maxTagPlaceholder
          )),
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
      maxTagPlaceholderFunction,
      props,
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
