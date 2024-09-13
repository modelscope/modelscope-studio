import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { Col as ACol, type GetProps, Row as ARow } from 'antd';

import { type Item } from '../context';

export const Row = sveltify<
  GetProps<typeof ARow> & {
    cols?: Item[];
  }
>(({ cols, children, ...props }) => {
  return (
    <ARow {...props}>
      {children}
      {cols?.map((item, index) => {
        if (!item) {
          return;
        }
        const { el, props: colProps } = item;
        return (
          <ACol {...colProps} key={index}>
            {el && <ReactSlot slot={el} />}
          </ACol>
        );
      })}
    </ARow>
  );
});

export default Row;
