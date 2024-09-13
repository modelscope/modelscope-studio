import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Slider as ASlider } from 'antd';

import { type Item } from './context';

type SliderProps = GetProps<typeof ASlider>;

const renderMarks = (items: Item[]) => {
  return items.reduce(
    (acc, v) => {
      const number = v?.props.number;
      if (number !== undefined) {
        acc[number] =
          v?.slots.label instanceof Element ? (
            {
              ...v.props,
              label: <ReactSlot slot={v?.slots.label} />,
            }
          ) : v?.slots.children instanceof Element ? (
            <ReactSlot slot={v?.slots.children} />
          ) : (
            {
              ...v?.props,
            }
          );
      }
      return acc;
    },
    {} as NonNullable<SliderProps['marks']>
  );
};

export const Slider = sveltify<
  SliderProps & {
    onValueChange: (value: number | number[]) => void;
    children?: React.ReactNode;
    markItems: Item[];
  }
>(
  ({
    marks,
    markItems,
    children,
    onValueChange,
    onChange,
    elRef,
    tooltip,
    ...props
  }) => {
    const onSliderChange = (v: number | number[]) => {
      onChange?.(v as any);
      onValueChange(v);
    };
    const tooltipGetPopupContainerFunction = useFunction(
      tooltip?.getPopupContainer
    );
    const tooltipFormatterFunction = useFunction(tooltip?.formatter);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ASlider
          {...props}
          tooltip={{
            ...tooltip,
            getPopupContainer: tooltipGetPopupContainerFunction,
            formatter: tooltipFormatterFunction,
          }}
          marks={useMemo(() => {
            return marks || renderMarks(markItems);
          }, [markItems, marks])}
          ref={elRef}
          onChange={onSliderChange}
        />
      </>
    );
  }
);

export default Slider;
