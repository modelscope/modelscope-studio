import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Listy as AListy } from 'antd';

type ListyProps = GetProps<typeof AListy>;
type ListyGroup = NonNullable<ListyProps['group']>;

export const Listy = sveltify<
  Omit<ListyProps, 'rowKey' | 'itemRender' | 'group'> & {
    rowKey?: ListyProps['rowKey'];
    itemRender?: ListyProps['itemRender'] | string;
    group?: {
      key?: ListyGroup['key'] | string;
      title?: ListyGroup['title'] | string;
    };
    children?: React.ReactNode;
  },
  ['itemRender', 'group.title']
>(({ children, slots, group, rowKey, itemRender, ...props }) => {
  const rowKeyFunction = useFunction(rowKey, true);
  const itemRenderFunction = useFunction(itemRender);
  const groupKeyFunction = useFunction(group?.key);
  const groupTitleFunction = useFunction(group?.title);
  const itemRenderSlot = slots.itemRender;
  const groupTitleSlot = slots['group.title'];
  const mergedGroup = useMemo(() => {
    if (!group) {
      return undefined;
    }
    return {
      ...group,
      key: groupKeyFunction || group.key,
      title: groupTitleSlot
        ? renderParamsSlot({ slots, key: 'group.title' })
        : groupTitleFunction || group.title,
    } as ListyProps['group'];
  }, [group, groupKeyFunction, groupTitleFunction, groupTitleSlot, slots]);
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <AListy
        {...props}
        rowKey={(rowKeyFunction || rowKey) as ListyProps['rowKey']}
        itemRender={
          (itemRenderSlot
            ? renderParamsSlot({ slots, key: 'itemRender' })
            : itemRenderFunction) as ListyProps['itemRender']
        }
        group={mergedGroup}
      />
    </>
  );
});

export default Listy;
