import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { FileCard as XFileCard, type FileCardListProps } from '@ant-design/x';
import { useFunction } from '@utils/hooks/useFunction';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderItems } from '@utils/renderItems';
import type { ItemType } from 'antd/es/menu/interface';

import { useItems, withItemsContextProvider } from './context';

export const FileCardList = sveltify<
  FileCardListProps & {
    children?: React.ReactNode;
  },
  ['extension']
>(
  withItemsContextProvider(
    ['default', 'items'],
    ({ slots, items, children, extension, removable, ...props }) => {
      const { items: slotItems } = useItems<['default', 'items']>();
      const resolvedSlotItems = slotItems.items?.length
        ? slotItems.items
        : slotItems.default;
      const removableFunction = useFunction(removable);
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <XFileCard.List
            {...omitUndefinedProps(props)}
            extension={
              slots.extension ? <ReactSlot slot={slots.extension} /> : extension
            }
            removable={removableFunction || removable}
            items={useMemo(() => {
              // ['label','icon',"title"]
              return (
                items ||
                renderItems<ItemType>(resolvedSlotItems || [], {
                  clone: true,
                })
              );
            }, [items, resolvedSlotItems])}
          />
        </>
      );
    }
  )
);

export default FileCardList;
