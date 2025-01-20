import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { Col as ACol, type GetProps, Row as ARow } from 'antd';

import { useItems, withItemsContext } from '../context';

export const Row = sveltify<GetProps<typeof ARow>>(
  withItemsContext(['default'], ({ children, ...props }) => {
    const {
      items: { default: cols },
    } = useItems<['default']>();
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ARow {...props}>
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
      </>
    );
  })
);

export default Row;
