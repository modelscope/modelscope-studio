import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { type GetProps, Splitter as ASplitter } from 'antd';

import { type Item } from './context';

export const Splitter = sveltify<
  GetProps<typeof ASplitter> & {
    items?: Item[];
  }
>(({ items, children, ...props }) => {
  return (
    <>
      <div style={{ display: 'none' }}>{children}</div>
      <ASplitter {...props}>
        {items?.map((item, index) => {
          if (!item) {
            return;
          }
          const { el, props: panelProps } = item;

          return (
            <ASplitter.Panel {...panelProps} key={index}>
              {el && <ReactSlot slot={el} />}
            </ASplitter.Panel>
          );
        })}
      </ASplitter>
    </>
  );
});

export default Splitter;
