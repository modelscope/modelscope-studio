import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, TimePicker as ATimePicker } from 'antd';
import dayjs from 'dayjs';

type RangePickerProps = GetProps<typeof ATimePicker.RangePicker>;

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

export const TimeRangePicker = sveltify<
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
  ({
    slots,
    disabledDate,
    disabledTime,
    value,
    defaultValue,
    defaultPickerValue,
    pickerValue,
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
    const disabledTimeFunction = useFunction(disabledTime);
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
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <ATimePicker.RangePicker
          {...props}
          ref={elRef}
          value={validValue}
          disabledTime={disabledTimeFunction}
          defaultValue={validDefaultValue}
          defaultPickerValue={validDefaultPickerValue}
          pickerValue={validPickerValue}
          minDate={validMinDate}
          maxDate={validMaxDate}
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
              ? () =>
                  slots.renderExtraFooter ? (
                    <ReactSlot slot={slots.renderExtraFooter} />
                  ) : null
              : props.renderExtraFooter
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
                  clearIcon: <ReactSlot slot={slots['allowClear.clearIcon']} />,
                }
              : props.allowClear
          }
          separator={
            slots.separator ? (
              <ReactSlot slot={slots.separator} />
            ) : (
              props.separator
            )
          }
        />
      </>
    );
  }
);

export default TimeRangePicker;
