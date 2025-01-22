import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { DatePicker as ADatePicker, type GetProps } from 'antd';
import dayjs from 'dayjs';

import { useItems, withItemsContextProvider } from '../context';

type RangePickerProps = GetProps<typeof ADatePicker.RangePicker>;

function formatDayjs(date: any) {
  if (typeof date === 'number') {
    return dayjs(date * 1000);
  }
  return dayjs(date);
}

function formatDates(
  dates: [dayjs.Dayjs | null | undefined, dayjs.Dayjs | null | undefined] | null
): [number | null, number | null] {
  return (dates?.map((date) => {
    return date ? date.valueOf() / 1000 : null;
  }) || [null, null]) as [number | null, number | null];
}

export const DateRangePicker = sveltify<
  Omit<RangePickerProps, 'onChange' | 'onCalendarChange' | 'onPanelChange'> & {
    onChange?: (dates: [number | null, number | null], ...args: any[]) => void;
    onPanelChange?: (
      dates: [number | null, number | null],
      ...args: any[]
    ) => void;
    onCalendarChange?: (
      dates: [number | null, number | null],
      ...args: any[]
    ) => void;
    onValueChange: (dates: [number | null, number | null]) => void;
    setSlotParams: SetSlotParams;
  },
  [
    'allowClear.clearIcon',
    'prefix',
    'prevIcon',
    'nextIcon',
    'suffixIcon',
    'superNextIcon',
    'superPrevIcon',
    'renderExtraFooter',
    'separator',
    'cellRender',
    'panelRender',
  ]
>(
  withItemsContextProvider(
    ['presets'],
    ({
      slots,
      disabledDate,
      value,
      defaultValue,
      defaultPickerValue,
      pickerValue,
      presets,
      showTime,
      onChange,
      minDate,
      maxDate,
      cellRender,
      panelRender,
      getPopupContainer,
      onValueChange,
      onPanelChange,
      onCalendarChange,
      children,
      setSlotParams,
      elRef,
      ...props
    }) => {
      const disabledDateFunction = useFunction(disabledDate);
      const getPopupContainerFunction = useFunction(getPopupContainer);
      const cellRenderFunction = useFunction(cellRender);
      const panelRenderFunction = useFunction(panelRender);
      const validShowTime = useMemo(() => {
        if (typeof showTime === 'object') {
          return {
            ...showTime,
            defaultValue: showTime.defaultValue?.map((v) => formatDayjs(v)),
          };
        }
        return showTime;
      }, [showTime]);
      const validValue = useMemo(() => {
        return value?.map((v) => formatDayjs(v)) as RangePickerProps['value'];
      }, [value]);

      const validDefaultValue = useMemo(() => {
        return defaultValue?.map((v) =>
          formatDayjs(v)
        ) as RangePickerProps['defaultValue'];
      }, [defaultValue]);
      const validDefaultPickerValue = useMemo(() => {
        if (Array.isArray(defaultPickerValue)) {
          return defaultPickerValue.map((v) =>
            formatDayjs(v)
          ) as RangePickerProps['defaultPickerValue'];
        }
        return defaultPickerValue ? formatDayjs(defaultPickerValue) : undefined;
      }, [defaultPickerValue]);
      const validPickerValue = useMemo(() => {
        if (Array.isArray(pickerValue)) {
          return pickerValue.map((v) =>
            formatDayjs(v)
          ) as RangePickerProps['pickerValue'];
        }
        return pickerValue ? formatDayjs(pickerValue) : undefined;
      }, [pickerValue]);
      const validMinDate = useMemo(() => {
        return minDate ? formatDayjs(minDate) : undefined;
      }, [minDate]);
      const validMaxDate = useMemo(() => {
        return maxDate ? formatDayjs(maxDate) : undefined;
      }, [maxDate]);
      const {
        items: { presets: presetItems },
      } = useItems<['presets']>();
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ADatePicker.RangePicker
            {...props}
            ref={elRef}
            value={validValue}
            defaultValue={validDefaultValue}
            defaultPickerValue={validDefaultPickerValue}
            pickerValue={validPickerValue}
            minDate={validMinDate}
            maxDate={validMaxDate}
            showTime={validShowTime}
            disabledDate={disabledDateFunction}
            getPopupContainer={getPopupContainerFunction}
            cellRender={
              slots.cellRender
                ? renderParamsSlot({ slots, setSlotParams, key: 'cellRender' })
                : cellRenderFunction
            }
            panelRender={
              slots.panelRender
                ? renderParamsSlot({ slots, setSlotParams, key: 'panelRender' })
                : panelRenderFunction
            }
            presets={useMemo(() => {
              return (
                presets ||
                renderItems<NonNullable<RangePickerProps['presets']>[number]>(
                  presetItems
                )
              )?.map((preset) => {
                return {
                  ...preset,
                  value: formatDates(preset.value as any),
                };
              }) as NonNullable<RangePickerProps['presets']>;
            }, [presets, presetItems])}
            onPanelChange={(dates, ...args) => {
              const formattedDates = formatDates(dates);
              onPanelChange?.(formattedDates, ...args);
            }}
            onChange={(dates, ...args) => {
              const formattedDates = formatDates(dates);
              onChange?.(formattedDates, ...args);
              onValueChange(formattedDates);
            }}
            onCalendarChange={(dates, ...args) => {
              const formattedDates = formatDates(dates);
              onCalendarChange?.(formattedDates, ...args);
            }}
            renderExtraFooter={
              slots.renderExtraFooter
                ? renderParamsSlot({
                    slots,
                    setSlotParams,
                    key: 'renderExtraFooter',
                  })
                : props.renderExtraFooter
            }
            prefix={
              slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix
            }
            prevIcon={
              slots.prevIcon ? (
                <ReactSlot slot={slots.prevIcon} />
              ) : (
                props.prevIcon
              )
            }
            nextIcon={
              slots.nextIcon ? (
                <ReactSlot slot={slots.nextIcon} />
              ) : (
                props.nextIcon
              )
            }
            suffixIcon={
              slots.suffixIcon ? (
                <ReactSlot slot={slots.suffixIcon} />
              ) : (
                props.suffixIcon
              )
            }
            superNextIcon={
              slots.superNextIcon ? (
                <ReactSlot slot={slots.superNextIcon} />
              ) : (
                props.superNextIcon
              )
            }
            superPrevIcon={
              slots.superPrevIcon ? (
                <ReactSlot slot={slots.superPrevIcon} />
              ) : (
                props.superPrevIcon
              )
            }
            allowClear={
              slots['allowClear.clearIcon']
                ? {
                    clearIcon: (
                      <ReactSlot slot={slots['allowClear.clearIcon']} />
                    ),
                  }
                : props.allowClear
            }
            separator={
              slots.separator ? (
                <ReactSlot slot={slots.separator} clone />
              ) : (
                props.separator
              )
            }
          />
        </>
      );
    }
  )
);

export default DateRangePicker;
