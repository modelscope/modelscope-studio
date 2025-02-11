import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';
import { Sender as XSender, type SenderProps } from '@ant-design/x';
import type { FileData } from '@gradio/client';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';
import { renderParamsSlot } from '@utils/renderParamsSlot';

export const Sender = sveltify<
  Omit<SenderProps, 'onPasteFile'> & {
    children?: React.ReactNode;
    setSlotParams: SetSlotParams;
    upload: (files: File[]) => Promise<FileData[]>;
    onPasteFile?: (value: FileData[]) => void;
    onValueChange: (value: string) => void;
  },
  ['actions', 'header', 'prefix']
>(
  ({
    slots,
    children,
    setSlotParams,
    onValueChange,
    onChange,
    onPasteFile,
    upload,
    elRef,
    ...props
  }) => {
    const actionsFunction = useFunction(props.actions, true);
    const [value, setValue] = useValueChange({
      onValueChange,
      value: props.value,
    });
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <XSender
          {...props}
          value={value}
          ref={elRef}
          onChange={(v) => {
            onChange?.(v);
            setValue(v);
          }}
          onPasteFile={async (file) => {
            const urls = await upload(Array.isArray(file) ? file : [file]);
            onPasteFile?.(urls);
          }}
          header={
            slots.header ? <ReactSlot slot={slots.header} /> : props.header
          }
          prefix={
            slots.prefix ? <ReactSlot slot={slots.prefix} /> : props.prefix
          }
          actions={
            slots.actions
              ? renderParamsSlot(
                  {
                    slots,
                    setSlotParams,
                    key: 'actions',
                  },
                  { clone: true }
                )
              : actionsFunction || props.actions
          }
        />
      </>
    );
  }
);

export default Sender;
