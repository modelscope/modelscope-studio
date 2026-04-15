import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { renderParamsSlot } from '@utils/renderParamsSlot';
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
    'render',
    'actions',
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
    const actions = useTargets(children, 'actions');
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
            onValueChange(targetKeys as (string | number)[]);
            onChange?.(targetKeys, ...args);
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
            slots.render
              ? renderParamsSlot({ slots, key: 'render' })
              : renderFunction ||
                ((item) => ({
                  label: item.title || item.label,
                  value: item.value || item.title || item.label,
                }))
          }
          filterOption={filterOptionFunction}
          footer={
            slots.footer
              ? renderParamsSlot({ slots, key: 'footer' })
              : footerFunction || footer
          }
          titles={
            titles.length > 0
              ? titles.map((target, index) => {
                  return <ReactSlot slot={target} key={index} />;
                })
              : props.titles
          }
          listStyle={listStyleFunction || listStyle}
          actions={
            actions.length > 0
              ? actions.map((target, index) => {
                  return <ReactSlot slot={target} key={index} />;
                })
              : props.actions
          }
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
