import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useValueChange } from '@utils/hooks/useValueChange';
import { renderItems } from '@utils/renderItems';
import { Cascader as ACascader, type CascaderPanelProps } from 'antd';

import { type Item } from '../context';

export const CascaderPanel = sveltify<
  CascaderPanelProps<any> & {
    onValueChange: (value: string[] | number[]) => void;
    onLoadData?: (...args: any[]) => void;
    optionItems: Item[];
    children?: React.ReactNode;
  },
  ['notFoundContent', 'expandIcon']
>(
  ({
    slots,
    children,
    onValueChange,
    onChange,
    onLoadData,
    optionItems,
    options,
    ...props
  }) => {
    const [value, setValue] = useValueChange({
      onValueChange,
      value: props.value,
    });
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ACascader.Panel
          {...props}
          value={value}
          options={useMemo(() => {
            return (
              options ||
              renderItems<NonNullable<CascaderPanelProps['options']>[number]>(
                optionItems,
                { clone: true }
              )
            );
          }, [options, optionItems])}
          loadData={onLoadData}
          onChange={(v, ...args) => {
            onChange?.(v, ...args);
            setValue(v);
          }}
          expandIcon={
            slots.expandIcon ? (
              <ReactSlot slot={slots.expandIcon} />
            ) : (
              props.expandIcon
            )
          }
          notFoundContent={
            slots.notFoundContent ? (
              <ReactSlot slot={slots.notFoundContent} />
            ) : (
              props.notFoundContent
            )
          }
        />
      </>
    );
  }
);

export default CascaderPanel;
