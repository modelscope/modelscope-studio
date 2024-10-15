import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Calendar as ACalendar, type GetProps } from 'antd';
import dayjs from 'dayjs';

type CalendarProps = GetProps<typeof ACalendar>;

function formatDayjs(date: any) {
  if (typeof date === 'number') {
    return dayjs(date * 1000);
  }
  return dayjs(date);
}

export const Calendar = sveltify<
  Omit<CalendarProps, 'onChange' | 'onPanelChange' | 'onSelect'> & {
    onChange?: (date: number, ...args: any[]) => void;
    onPanelChange?: (date: number, ...args: any[]) => void;
    onSelect?: (date: number, ...args: any[]) => void;
    onValueChange: (date: number) => void;
    setSlotParams: SetSlotParams;
  },
  ['cellRender', 'fullCellRender', 'headerRender']
>(
  ({
    disabledDate,
    value,
    defaultValue,
    validRange,
    onChange,
    onPanelChange,
    onSelect,
    onValueChange,
    setSlotParams,
    cellRender,
    fullCellRender,
    headerRender,
    slots,
    ...props
  }) => {
    const disabledDateFunction = useFunction(disabledDate);
    const cellRenderFunction = useFunction(cellRender);
    const fullCellRenderFunction = useFunction(fullCellRender);
    const headerRenderFunction = useFunction(headerRender);
    const validValue = useMemo(() => {
      return value ? formatDayjs(value) : undefined;
    }, [value]);
    const validDefaultValue = useMemo(() => {
      return defaultValue ? formatDayjs(defaultValue) : undefined;
    }, [defaultValue]);
    const validValidRange = useMemo(() => {
      return Array.isArray(validRange)
        ? (validRange.map((v) => formatDayjs(v)) as [dayjs.Dayjs, dayjs.Dayjs])
        : undefined;
    }, [validRange]);
    return (
      <ACalendar
        {...props}
        value={validValue}
        defaultValue={validDefaultValue}
        validRange={validValidRange}
        disabledDate={disabledDateFunction}
        cellRender={
          slots.cellRender
            ? renderParamsSlot({ slots, setSlotParams, key: 'cellRender' })
            : cellRenderFunction
        }
        fullCellRender={
          slots.fullCellRender
            ? renderParamsSlot({ slots, setSlotParams, key: 'fullCellRender' })
            : fullCellRenderFunction
        }
        headerRender={
          slots.headerRender
            ? renderParamsSlot({ slots, setSlotParams, key: 'headerRender' })
            : headerRenderFunction
        }
        onChange={(date, ...args) => {
          onValueChange(date.valueOf() / 1000);
          onChange?.(date.valueOf() / 1000, ...args);
        }}
        onPanelChange={(date, ...args) => {
          onPanelChange?.(date.valueOf() / 1000, ...args);
        }}
        onSelect={(date, ...args) => {
          onSelect?.(date.valueOf() / 1000, ...args);
        }}
      />
    );
  }
);

export default Calendar;
