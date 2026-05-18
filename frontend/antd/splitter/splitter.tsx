import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { type GetProps, Splitter as ASplitter } from 'antd';

import { useItems, withItemsContextProvider } from './context';

export const Splitter = sveltify<
  GetProps<typeof ASplitter>,
  ['draggerIcon', 'collapsible.icon.start', 'collapsible.icon.end']
>(
  withItemsContextProvider(['default'], ({ children, slots, ...props }) => {
    const {
      items: { default: panels },
    } = useItems<['default']>();
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        {panels.length ? (
          <ASplitter
            {...props}
            collapsible={{
              ...props.collapsible,
              icon:
                slots['collapsible.icon.start'] || slots['collapsible.icon.end']
                  ? {
                      start: slots['collapsible.icon.start'] ? (
                        <ReactSlot
                          slot={slots['collapsible.icon.start']}
                          clone
                        />
                      ) : (
                        props.collapsible?.icon?.start
                      ),
                      end: slots['collapsible.icon.end'] ? (
                        <ReactSlot slot={slots['collapsible.icon.end']} clone />
                      ) : (
                        props.collapsible?.icon?.end
                      ),
                    }
                  : props.collapsible?.icon,
            }}
            draggerIcon={
              slots.draggerIcon ? (
                <ReactSlot slot={slots.draggerIcon} clone />
              ) : (
                props.draggerIcon
              )
            }
          >
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
