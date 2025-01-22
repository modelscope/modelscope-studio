import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderItems } from '@utils/renderItems';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { DatePicker as ADatePicker, type GetProps } from 'antd';
import dayjs from 'dayjs';

import { useItems, withItemsContextProvider } from './context';

type DatePickerProps = GetProps<typeof ADatePicker>;

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

export const DatePicker = sveltify<
  Omit<DatePickerProps, 'onChange' | 'onPanelChange'> & {
    onChange?: (date: ReturnType<typeof formatDate>, ...args: any[]) => void;
    onPanelChange?: (
      date: ReturnType<typeof formatDate>,
      ...args: any[]
    ) => void;
    onValueChange: (date: ReturnType<typeof formatDate>) => void;
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
    'cellRender',
    'panelRender',
  ]
>(
  withItemsContextProvider(
    ['presets'],
    ({
      slots,
      disabledDate,
      disabledTime,
      value,
      defaultValue,
      defaultPickerValue,
      pickerValue,
      showTime,
      presets,
      onChange,
      minDate,
      maxDate,
      cellRender,
      panelRender,
      getPopupContainer,
      onValueChange,
      onPanelChange,
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
      const validShowTime = useMemo(() => {
        if (typeof showTime === 'object') {
          return {
            ...showTime,
            defaultValue: showTime.defaultValue
              ? formatDayjs(showTime.defaultValue)
              : undefined,
          };
        }
        return showTime;
      }, [showTime]);
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
      const {
        items: { presets: presetItems },
      } = useItems<['presets']>();
      return (
        <>
          <div style={{ display: 'none' }}>{children}</div>
          <ADatePicker
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
            disabledTime={disabledTimeFunction}
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
                renderItems<NonNullable<DatePickerProps['presets']>[number]>(
                  presetItems
                )
              )?.map((preset) => {
                return {
                  ...preset,
                  value: formatDayjs(preset.value),
                };
              });
            }, [presets, presetItems])}
            onPanelChange={(date, ...args) => {
              const formattedDates = formatDate(date);
              onPanelChange?.(formattedDates, ...args);
            }}
            onChange={(date, ...args) => {
              const formattedDate = formatDate(date);
              onChange?.(formattedDate, ...args);
              onValueChange(formattedDate);
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
            prevIcon={
              slots.prevIcon ? (
                <ReactSlot slot={slots.prevIcon} />
              ) : (
                props.prevIcon
              )
            }
            prefix={
              slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix
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
          />
        </>
      );
    }
  )
);

export default DatePicker;
