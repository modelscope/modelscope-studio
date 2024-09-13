import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { type GetProps, Transfer as ATransfer } from 'antd';

export const Transfer = sveltify<
  GetProps<typeof ATransfer> & {
    children?: React.ReactNode;
    onValueChange: (value: (string | number)[]) => void;
  },
  [
    'selectionsIcon',
    'titles',
    'footer',
    'locale.notFoundContent',
    'selectAllLabels',
  ]
>(
  ({
    slots,
    children,
    render,
    filterOption,
    footer,
    listStyle,
    locale,
    onChange,
    onValueChange,
    ...props
  }) => {
    const titles = useTargets(children, 'titles');
    const selectAllLabels = useTargets(children, 'selectAllLabels');
    const renderFunction = useFunction(render);
    const listStyleFunction = useFunction(listStyle);
    const footerFunction = useFunction(footer);
    const filterOptionFunction = useFunction(filterOption);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ATransfer
          {...props}
          onChange={(targetKeys, ...args) => {
            onChange?.(targetKeys, ...args);
            onValueChange(targetKeys as (string | number)[]);
          }}
          selectionsIcon={
            slots.selectionsIcon ? (
              <ReactSlot slot={slots.selectionsIcon} />
            ) : (
              props.selectionsIcon
            )
          }
          locale={
            slots['locale.notFoundContent']
              ? {
                  ...locale,
                  notFoundContent: (
                    <ReactSlot slot={slots['locale.notFoundContent']} />
                  ),
                }
              : locale
          }
          render={
            renderFunction ||
            ((item) => ({
              label: item.title || item.label,
              value: item.value || item.title || item.label,
            }))
          }
          filterOption={filterOptionFunction}
          footer={
            footerFunction ||
            (slots.footer
              ? () => (slots.footer ? <ReactSlot slot={slots.footer} /> : null)
              : footer)
          }
          titles={
            titles.length > 0
              ? titles.map((target, index) => {
                  return <ReactSlot slot={target} key={index} />;
                })
              : props.titles
          }
          listStyle={listStyleFunction || listStyle}
          selectAllLabels={
            selectAllLabels.length > 0
              ? selectAllLabels.map((target, index) => {
                  return <ReactSlot slot={target} key={index} />;
                })
              : props.selectAllLabels
          }
        />
      </>
    );
  }
);
export default Transfer;
