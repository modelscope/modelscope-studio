import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { type GetProps, Splitter as ASplitter } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Splitter = sveltify<GetProps<typeof ASplitter>>(
  withItemsContextProvider(['default'], ({ children, ...props }) => {
    const {
      items: { default: panels },
    } = useItems<['default']>();
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        {panels.length ? (
          <ASplitter {...props}>
            {panels?.map((item, index) => {
              if (!item) {
                return null;
              }
              const { el, props: panelProps } = item;
              return (
                <ASplitter.Panel {...panelProps} key={index}>
                  {el && <ReactSlot slot={el} />}
                </ASplitter.Panel>
              );
            })}
          </ASplitter>
        ) : null}
      </>
    );
  })
);

export default Splitter;
