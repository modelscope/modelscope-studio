import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, TimePicker as ATimePicker } from 'antd';
import dayjs from 'dayjs';

type TimePickerProps = GetProps<typeof ATimePicker>;

function formatDayjs(date: any): dayjs.Dayjs {
  if (Array.isArray(date)) {
    return date.map((d) => {
      return formatDayjs(d) as dayjs.Dayjs;
    }) as unknown as dayjs.Dayjs;
  }
  if (typeof date === 'number') {
    return dayjs(date * 1000);
  }
  return dayjs(date);
}

function formatDate(dates: (dayjs.Dayjs | null | undefined)[] | dayjs.Dayjs) {
  if (Array.isArray(dates)) {
    return dates.map((date) => {
      return date ? date.valueOf() / 1000 : null;
    });
  }
  if (typeof dates === 'object' && dates !== null) {
    return dates.valueOf() / 1000;
  }
  return dates;
}

export const TimePicker = sveltify<
  Omit<TimePickerProps, 'onChange' | 'onPanelChange'> & {
    onChange?: (date: ReturnType<typeof formatDate>, ...args: any[]) => void;
    onPanelChange?: (
      date: ReturnType<typeof formatDate>,
      ...args: any[]
    ) => void;
    onCalendarChange?: (
      date: ReturnType<typeof formatDate>,
      ...args: any[]
    ) => void;
    onValueChange: (date: number | string) => void;
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
    const disabledTimeFunction = useFunction(disabledTime);
    const getPopupContainerFunction = useFunction(getPopupContainer);
    const cellRenderFunction = useFunction(cellRender);
    const panelRenderFunction = useFunction(panelRender);
    const validValue = useMemo(() => {
      return value ? formatDayjs(value) : undefined;
    }, [value]);
    const validDefaultValue = useMemo(() => {
      return defaultValue ? formatDayjs(defaultValue) : undefined;
    }, [defaultValue]);
    const validDefaultPickerValue = useMemo(() => {
      return defaultPickerValue ? formatDayjs(defaultPickerValue) : undefined;
    }, [defaultPickerValue]);
    const validPickerValue = useMemo(() => {
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
        <ATimePicker
          {...props}
          ref={elRef}
          value={validValue}
          defaultValue={validDefaultValue}
          defaultPickerValue={validDefaultPickerValue}
          pickerValue={validPickerValue}
          minDate={validMinDate}
          maxDate={validMaxDate}
          disabledTime={disabledTimeFunction}
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
          onPanelChange={(date, ...args) => {
            const formattedDates = formatDate(date);
            onPanelChange?.(formattedDates, ...args);
          }}
          onChange={(date, ...args) => {
            const formattedDate = formatDate(date);
            onChange?.(formattedDate, ...args);
            onValueChange(formattedDate as number);
          }}
          onCalendarChange={(date, ...args) => {
            const formattedDate = formatDate(date);
            onCalendarChange?.(formattedDate, ...args);
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
        />
      </>
    );
  }
);

export default TimePicker;
