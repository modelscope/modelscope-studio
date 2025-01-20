import { sveltify } from '@svelte-preprocess-react';
import React, { useEffect, useRef } from 'react';
import { type Col as ACol, type GetProps } from 'antd';
import { isEqual } from 'lodash-es';

import { type Item, useItems } from '../context';

export const Col = sveltify<
  GetProps<typeof ACol> & {
    itemIndex: number;
    itemSlotKey?: string;
    itemElement?: HTMLElement;
  },
  ['children']
>(({ itemIndex, itemSlotKey, itemElement, slots, ...props }) => {
  const prevValueRef = useRef<Item>();
  const { setItem } = useItems();
  useEffect(() => {
    if (itemElement) {
      const value: Item = {
        el: itemElement,
        props,
        slots,
      };
      if (!isEqual(prevValueRef.current, value)) {
        prevValueRef.current = value;
        setItem(itemSlotKey, itemIndex, value);
      }
    }
  }, [itemIndex, itemSlotKey, itemElement, props, setItem, slots]);
  return <span />;
});

export default Col;
