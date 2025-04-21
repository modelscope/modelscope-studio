import { sveltify } from '@svelte-preprocess-react';
import { useSuggestionOpenContext } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
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
import { useFunction } from '@utils/hooks/useFunction';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { useValueChange } from '@utils/hooks/useValueChange';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Badge, Button, theme, Tooltip, type UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { noop, omit } from 'lodash-es';

import { useRecorder } from './recorder';
import { processAudio } from './utils';

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
  allowUpload?: boolean;
  allowSpeech?: boolean;
  allowPasteFile?: boolean;
  showCount?: boolean;
  uploadButtonTooltip?: string;
  title?: string;
  placeholder?: {
    [K in 'inline' | 'drop']?: {
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
    setSlotParams: SetSlotParams;
    value?: MultimodalInputValue;
    upload: (files: File[]) => Promise<FileData[]>;
    onPasteFile?: (value: string[]) => void;
    onUpload?: (value: string[]) => void;
    onValueChange: (value: MultimodalInputValue) => void;
    onChange?: (value: MultimodalInputChangedValue) => void;
    onSubmit?: (value: MultimodalInputChangedValue) => void;
    uploadConfig?: UploadConfig;
  },
  ['actions', 'prefix', 'footer']
>(
  ({
    onValueChange,
    onChange,
    onPasteFile,
    onUpload,
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
    setSlotParams,
    uploadConfig: uploadConfigProp,
    value: valueProp,
    ...senderProps
  }) => {
    const [open, setOpen] = useState(false);
    const suggestionOpen = useSuggestionOpenContext();
    const recorderContainerRef = useRef<HTMLDivElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const actionsFunction = useFunction(senderProps.actions, true);
    const footerFunction = useFunction(senderProps.footer, true);
    const { token } = theme.useToken();
    const { start, stop, recording } = useRecorder({
      container: recorderContainerRef.current,
      async onStop(blob) {
        const audioFile = new File(
          [await processAudio(blob)],
          `${Date.now()}_recording_result.wav`,
          {
            type: 'audio/wav',
          }
        );
        uploadFile(audioFile);
      },
    });
    const [value, setValue] = useValueChange({
      onValueChange,
      value: valueProp,
    });
    const uploadConfig = useMemo(
      () => convertObjectKeyToCamelCase(uploadConfigProp),
      [uploadConfigProp]
    );
    const uploadDisabled =
      disabled || uploadConfig?.disabled || loading || readOnly || uploading;

    const uploadFile = useMemoizedFn(async (file: File | File[]) => {
      try {
        if (uploadDisabled) {
          return;
        }
        setUploading(true);
        const maxCount = uploadConfig?.maxCount;
        if (
          typeof maxCount === 'number' &&
          maxCount > 0 &&
          fileList.length >= maxCount
        ) {
          return;
        }
        let validFiles = Array.isArray(file) ? file : [file];
        if (maxCount === 1) {
          validFiles = validFiles.slice(0, 1);
        } else if (validFiles.length === 0) {
          setUploading(false);
          return;
        } else if (typeof maxCount === 'number') {
          const max = maxCount - fileList.length;
          validFiles = validFiles.slice(0, max < 0 ? 0 : max);
        }

        const lastFileList = fileList;
        const tempFileList = validFiles.map((v) => {
          return {
            ...v,
            size: v.size,
            uid: `${v.name}-${Date.now()}`,
            name: v.name,
            status: 'uploading' as const,
          };
        });
        setFileList((prev) => [
          ...(maxCount === 1 ? [] : prev),
          ...tempFileList,
        ]);
        const fileDataList = (await upload(validFiles))
          .filter(Boolean)
          .map((v, i) => {
            return {
              ...v,
              uid: tempFileList[i].uid,
            };
          });

        const mergedFileList =
          maxCount === 1
            ? fileDataList
            : ([...lastFileList, ...fileDataList] as FileData[]);
        onUpload?.(fileDataList.map((url) => url.path));
        setUploading(false);
        const newValue: MultimodalInputValue = {
          ...value,
          files: mergedFileList,
        };
        onChange?.(formatChangedValue(newValue));
        setValue(newValue);
        return fileDataList;
      } catch {
        setUploading(false);
        return [];
      }
    });
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
      const visited: Record<string, number> = {};
      return (
        fileList.map((file) => {
          if (!isUploadFile(file)) {
            const uid = file.uid || file.url || file.path;
            if (!visited[uid]) {
              visited[uid] = 0;
            }
            visited[uid]++;
            return {
              ...file,
              name: file.orig_name || file.path,
              uid: file.uid || uid + '-' + visited[uid],
              status: 'done' as const,
            };
          }
          return file;
        }) || []
      );
    }, [fileList]);

    const allowUpload = uploadConfig?.allowUpload ?? true;
    const allowSpeech = allowUpload ? uploadConfig?.allowSpeech : false;
    const allowPasteFile = allowUpload ? uploadConfig?.allowPasteFile : false;

    return (
      <>
        <div style={{ display: 'none' }} ref={recorderContainerRef} />
        <div style={{ display: 'none' }}>{children}</div>
        <Sender
          {...senderProps}
          value={value?.text}
          ref={elRef}
          disabled={disabled}
          readOnly={readOnly}
          allowSpeech={
            allowSpeech
              ? {
                  recording,
                  onRecordingChange(isRecording) {
                    if (uploadDisabled) {
                      return;
                    }
                    if (isRecording) {
                      start();
                    } else {
                      stop();
                    }
                  },
                }
              : false
          }
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
          onPasteFile={async (_file, files) => {
            if (!(allowPasteFile ?? true)) {
              return;
            }
            const filesData = await uploadFile(Array.from(files));
            if (filesData) {
              onPasteFile?.(filesData.map((url) => url.path));
            }
          }}
          prefix={
            <>
              {allowUpload ? (
                <Tooltip title={uploadConfig?.uploadButtonTooltip}>
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
              ) : null}
              {slots.prefix ? <ReactSlot slot={slots.prefix} /> : null}
            </>
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
              : actionsFunction || senderProps.actions
          }
          footer={
            slots.footer
              ? renderParamsSlot({ slots, setSlotParams, key: 'footer' })
              : footerFunction || senderProps.footer
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
                imageProps={{
                  ...uploadConfig?.imageProps,
                  wrapperStyle: {
                    width: '100%',
                    height: '100%',
                    ...uploadConfig?.imageProps?.wrapperStyle,
                  },
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: token.borderRadius,
                    ...uploadConfig?.imageProps?.style,
                  },
                }}
                disabled={uploadDisabled}
                getDropContainer={() => {
                  return uploadConfig?.fullscreenDrop ? document.body : null;
                }}
                items={validFileList}
                placeholder={(type) => {
                  const isDrop = type === 'drop';
                  return {
                    title: isDrop
                      ? (uploadConfig?.placeholder?.drop?.title ??
                        'Drop file here')
                      : (uploadConfig?.placeholder?.inline?.title ??
                        'Upload files'),
                    description: isDrop
                      ? (uploadConfig?.placeholder?.drop?.description ??
                        undefined)
                      : (uploadConfig?.placeholder?.inline?.description ??
                        'Click or drag files to this area to upload'),
                    icon: isDrop
                      ? (uploadConfig?.placeholder?.drop?.icon ?? undefined)
                      : (uploadConfig?.placeholder?.inline?.icon ?? (
                          <CloudUploadOutlined />
                        )),
                  };
                }}
                onDownload={onDownload}
                onPreview={onPreview}
                onDrop={onDrop}
                onChange={async (info) => {
                  try {
                    const file = info.file;
                    const files = info.fileList;
                    // remove
                    const index = validFileList.findIndex(
                      (v) => v.uid === file.uid
                    );

                    if (index !== -1) {
                      if (uploadDisabled) {
                        return;
                      }
                      onRemove?.(file);
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
                      if (uploadDisabled) {
                        return;
                      }
                      setUploading(true);
                      let validFiles = files.filter((v) => v.status !== 'done');

                      const maxCount = uploadConfig?.maxCount;
                      if (maxCount === 1) {
                        validFiles = validFiles.slice(0, 1);
                      } else if (validFiles.length === 0) {
                        setUploading(false);
                        return;
                      } else if (typeof maxCount === 'number') {
                        const max = maxCount - fileList.length;
                        validFiles = validFiles.slice(0, max < 0 ? 0 : max);
                      }

                      const lastFileList = fileList;
                      const tempFileList = validFiles.map((v) => {
                        return {
                          ...v,
                          size: v.size,
                          uid: v.uid,
                          name: v.name,
                          status: 'uploading' as const,
                        };
                      });
                      setFileList((prev) => [
                        ...(maxCount === 1 ? [] : prev),
                        ...tempFileList,
                      ]);
                      const fileDataList = (
                        await upload(
                          validFiles.map((f) => f.originFileObj as RcFile)
                        )
                      )
                        .filter(Boolean)
                        .map((v, i) => {
                          return {
                            ...v,
                            uid: tempFileList[i].uid,
                          };
                        });
                      const mergedFileList =
                        maxCount === 1
                          ? fileDataList
                          : ([...lastFileList, ...fileDataList] as FileData[]);
                      onUpload?.(fileDataList.map((url) => url.path));
                      setUploading(false);
                      const newValue: MultimodalInputValue = {
                        ...value,
                        files: mergedFileList,
                      };

                      setFileList(mergedFileList);
                      onValueChange?.(newValue);
                      onChange?.(formatChangedValue(newValue));
                    }
                  } catch (error) {
                    setUploading(false);
                    console.error(error);
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
