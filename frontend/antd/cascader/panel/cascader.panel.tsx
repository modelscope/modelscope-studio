import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useValueChange } from '@utils/hooks/useValueChange';
import { renderItems } from '@utils/renderItems';
import { Cascader as ACascader, type CascaderPanelProps } from 'antd';

import { useItems, withItemsContextProvider } from '../context';

export const CascaderPanel = sveltify<
  CascaderPanelProps<any> & {
    onValueChange: (value: string[] | number[]) => void;
    onLoadData?: (...args: any[]) => void;
    children?: React.ReactNode;
  },
  ['notFoundContent', 'expandIcon']
>(
  withItemsContextProvider(
    ['default', 'options'],
    ({
      slots,
      children,
      onValueChange,
      onChange,
      onLoadData,
      options,
      ...props
    }) => {
      const [value, setValue] = useValueChange({
        onValueChange,
        value: props.value,
      });
      const { items: slotItems } = useItems<['default', 'options']>();
      const resolvedSlotItems =
        slotItems.options.length > 0 ? slotItems.options : slotItems.default;
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
                  resolvedSlotItems,
                  {
                    clone: true,
                  }
                )
              );
            }, [options, resolvedSlotItems])}
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
  )
);

export default CascaderPanel;
