import { sveltify } from '@svelte-preprocess-react';
import { useSuggestionOpenContext } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import {
  Attachments,
  type AttachmentsProps,
  Sender,
  type SenderProps,
} from '@ant-design/x';
import { type FileData } from '@gradio/client';
import { convertObjectKeyToCamelCase } from '@utils/convertToCamelCase';
import { useValueChange } from '@utils/hooks/useValueChange';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { Badge, Button, Tooltip, type UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { noop, omit } from 'lodash-es';

const isUploadFile = (file: FileData | UploadFile): file is UploadFile => {
  return !!(file as UploadFile).name;
};

export interface MultimodalInputValue {
  files?: FileData[];
  text?: string;
}

export interface MultimodalInputChangedValue {
  files: string[];
  text: string;
}

export interface UploadConfig extends Omit<AttachmentsProps, 'placeholder'> {
  fullscreenDrop?: boolean;
  allowPasteFile?: boolean;
  showCount?: boolean;
  buttonTooltip?: string;
  title?: string;
  placeholder?: {
    [K in 'inline' | 'drop']: {
      title?: string;
      description?: string;
      icon?: string;
    };
  };
}

const formatChangedValue = (
  value: MultimodalInputValue | undefined
): MultimodalInputChangedValue => {
  return {
    text: value?.text || '',
    files: value?.files?.map((file) => file.path) || [],
  };
};

export const MultimodalInput = sveltify<
  Omit<
    SenderProps &
      Pick<
        AttachmentsProps,
        'onRemove' | 'onDownload' | 'onDrop' | 'onPreview'
      >,
    'onPasteFile' | 'value' | 'onSubmit'
  > & {
    children?: React.ReactNode;
    value?: MultimodalInputValue;
    upload: (files: RcFile[]) => Promise<FileData[]>;
    onPasteFile?: (value: string[]) => void;
    onValueChange: (value: MultimodalInputValue) => void;
    onChange?: (value: MultimodalInputChangedValue) => void;
    onSubmit?: (value: MultimodalInputChangedValue) => void;
    uploadConfig?: UploadConfig;
  },
  ['prefix']
>(
  ({
    onValueChange,
    onChange,
    onPasteFile,
    onSubmit,
    onRemove,
    onDownload,
    onDrop,
    onPreview,
    upload,
    onCancel,
    children,
    readOnly,
    loading,
    disabled,
    placeholder,
    elRef,
    slots,
    uploadConfig: uploadConfigProp,
    value: valueProp,
    ...senderProps
  }) => {
    const [open, setOpen] = useState(false);
    const suggestionOpen = useSuggestionOpenContext();

    // const [recording, setRecording] = useState(false);
    const [value, setValue] = useValueChange({
      onValueChange,
      value: valueProp,
    });
    const uploadConfig = useMemo(
      () => convertObjectKeyToCamelCase(uploadConfigProp),
      [uploadConfigProp]
    );
    const uploadingRef = useRef(false);
    const [fileList, setFileList] = useState<
      (
        | (FileData & {
            uid?: string;
          })
        | UploadFile
      )[]
    >(() => value?.files || []);

    useEffect(() => {
      setFileList(value?.files || []);
    }, [value?.files]);

    const validFileList = useMemo(() => {
      return (
        fileList.map((file) => {
          if (!isUploadFile(file)) {
            return {
              ...file,
              name: file.orig_name || file.path,
              uid: file.uid || file.url || file.path,
              status: 'done' as const,
            };
          }
          return file;
        }) || []
      );
    }, [fileList]);
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <Sender
          {...senderProps}
          value={value?.text}
          ref={elRef}
          disabled={disabled}
          readOnly={readOnly}
          // allowSpeech={{
          //   recording,
          //   onRecordingChange(isRecording) {
          //     setRecording(isRecording);
          //   },
          // }}
          placeholder={placeholder}
          loading={loading}
          onSubmit={() => {
            if (!suggestionOpen) {
              onSubmit?.(formatChangedValue(value));
            }
          }}
          onCancel={() => {
            onCancel?.();
          }}
          onChange={(v) => {
            const newValue: MultimodalInputValue = {
              ...value,
              text: v,
            };
            onChange?.(formatChangedValue(newValue));
            setValue(newValue);
          }}
          onPasteFile={async (file) => {
            if (!(uploadConfig?.allowPasteFile ?? true)) {
              return;
            }
            const maxCount = uploadConfig?.maxCount;
            if (
              typeof maxCount === 'number' &&
              maxCount > 0 &&
              fileList.length >= maxCount
            ) {
              return;
            }
            const filesData = await upload(
              (Array.isArray(file) ? file : [file]) as RcFile[]
            );

            onPasteFile?.(filesData.map((url) => url.path));
            const newValue: MultimodalInputValue = {
              ...value,
              files: [...(fileList as FileData[]), ...filesData],
            };
            onChange?.(formatChangedValue(newValue));
            setValue(newValue);
          }}
          prefix={
            <>
              <Tooltip title={uploadConfig?.buttonTooltip}>
                <Badge
                  count={
                    (uploadConfig?.showCount ?? true) && !open
                      ? validFileList.length
                      : 0
                  }
                >
                  <Button
                    onClick={() => {
                      setOpen(!open);
                    }}
                    color="default"
                    variant="text"
                    icon={<LinkOutlined />}
                  />
                </Badge>
              </Tooltip>
              {slots.prefix ? <ReactSlot slot={slots.prefix} /> : null}
            </>
          }
          header={
            <Sender.Header
              title={uploadConfig?.title || 'Attachments'}
              open={open}
              onOpenChange={setOpen}
            >
              <Attachments
                {...omitUndefinedProps(
                  omit(uploadConfig, [
                    'title',
                    'placeholder',
                    'showCount',
                    'buttonTooltip',
                    'allowPasteFile',
                  ]),
                  { omitNull: true }
                )}
                disabled={
                  disabled || uploadConfig?.disabled || loading || readOnly
                }
                getDropContainer={() => {
                  return uploadConfig?.fullscreenDrop ? document.body : null;
                }}
                items={validFileList}
                placeholder={(type) => {
                  const isDrop = type === 'drop';
                  return {
                    title: isDrop
                      ? (uploadConfig?.placeholder?.drop.title ??
                        'Drop file here')
                      : (uploadConfig?.placeholder?.inline.title ??
                        'Upload files'),
                    description: isDrop
                      ? (uploadConfig?.placeholder?.drop.description ??
                        undefined)
                      : (uploadConfig?.placeholder?.inline.description ??
                        'Click or drag files to this area to upload'),
                    icon: isDrop
                      ? (uploadConfig?.placeholder?.drop.icon ?? undefined)
                      : (uploadConfig?.placeholder?.inline.icon ?? (
                          <CloudUploadOutlined />
                        )),
                  };
                }}
                onDownload={onDownload}
                onPreview={onPreview}
                onDrop={onDrop}
                onRemove={(file) => {
                  if (uploadingRef.current) {
                    return;
                  }
                  onRemove?.(file);
                  const index = validFileList.findIndex(
                    (v) => v.uid === file.uid
                  );
                  const newFileList = fileList.slice() as FileData[];
                  newFileList.splice(index, 1);
                  const newValue: MultimodalInputValue = {
                    ...value,
                    files: newFileList,
                  };
                  setValue(newValue);
                  onChange?.(formatChangedValue(newValue));
                }}
                onChange={async (info) => {
                  const file = info.file;
                  const files = info.fileList;
                  // remove
                  if (validFileList.find((v) => v.uid === file.uid)) {
                    if (uploadingRef.current) {
                      return;
                    }
                    onRemove?.(file);
                    const index = validFileList.findIndex(
                      (v) => v.uid === file.uid
                    );
                    const newFileList = fileList.slice() as FileData[];
                    newFileList.splice(index, 1);
                    const newValue: MultimodalInputValue = {
                      ...value,
                      files: newFileList,
                    };
                    setValue(newValue);
                    onChange?.(formatChangedValue(newValue));
                  } else {
                    // add
                    if (uploadingRef.current) {
                      return false;
                    }
                    uploadingRef.current = true;
                    const validFiles = files.filter((v) => v.status !== 'done');
                    const lastFileList = fileList;
                    setFileList((prev) => [
                      ...prev,
                      ...validFiles.map((v) => {
                        return {
                          ...v,
                          size: v.size,
                          uid: v.uid,
                          name: v.name,
                          status: 'uploading' as const,
                        };
                      }),
                    ]);

                    const fileDataList = (
                      await upload(
                        validFiles.map((f) => f.originFileObj as RcFile)
                      )
                    ).filter((v) => v) as (FileData & { uid: string })[];
                    const mergedFileList = [
                      ...lastFileList,
                      ...fileDataList,
                    ] as FileData[];

                    uploadingRef.current = false;
                    const newValue: MultimodalInputValue = {
                      ...value,
                      files: mergedFileList,
                    };
                    onValueChange?.(newValue);
                    onChange?.(formatChangedValue(newValue));
                  }
                }}
                customRequest={noop}
              />
            </Sender.Header>
          }
        />
      </>
    );
  }
);

export default MultimodalInput;
