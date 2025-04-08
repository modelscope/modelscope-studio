import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Attachments as XAttachments,
  type AttachmentsProps,
} from '@ant-design/x';
import type { FileData } from '@gradio/client';
import { useFunction } from '@utils/hooks/useFunction';
import { useTargets } from '@utils/hooks/useTargets';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { theme, type UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { noop } from 'lodash-es';

import type { FileCardProps } from './file-card/file-card';

const isUploadFile = (file: FileData | UploadFile): file is UploadFile => {
  return !!(file as UploadFile).name;
};

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const Attachments = sveltify<
  Omit<AttachmentsProps, 'items' | 'onChange'> & {
    onValueChange?: (value: FileData[]) => void;
    onChange?: (value: string[]) => void;
    upload: (files: RcFile[]) => Promise<(FileData | null)[]>;
    items: FileData[];
    setSlotParams: SetSlotParams;
  },
  [
    'showUploadList.extra',
    'showUploadList.previewIcon',
    'showUploadList.removeIcon',
    'showUploadList.downloadIcon',
    'iconRender',
    'itemRender',
    'placeholder',
    'placeholder.title',
    'placeholder.description',
    'placeholder.icon',
    'imageProps.placeholder',
    'imageProps.preview.mask',
    'imageProps.preview.closeIcon',
    'imageProps.preview.toolbarRender',
    'imageProps.preview.imageRender',
  ]
>(
  ({
    slots,
    upload,
    showUploadList,
    progress,
    beforeUpload,
    customRequest,
    previewFile,
    isImageUrl,
    itemRender,
    iconRender,
    data,
    onChange,
    onValueChange,
    onRemove,
    items,
    setSlotParams,
    placeholder,
    getDropContainer,
    children,
    maxCount,
    imageProps,
    ...props
  }) => {
    // imageProps
    const previewConfig = getConfig(imageProps?.preview);
    const supportPreview =
      slots['imageProps.preview.mask'] ||
      slots['imageProps.preview.closeIcon'] ||
      slots['imageProps.preview.toolbarRender'] ||
      slots['imageProps.preview.imageRender'] ||
      imageProps?.preview !== false;
    const getContainerFunction = useFunction(previewConfig.getContainer);
    const previewToolbarRenderFunction = useFunction(
      previewConfig.toolbarRender
    );
    const previewImageRenderFunction = useFunction(previewConfig.imageRender);
    // imageProps

    const supportShowUploadListConfig =
      slots['showUploadList.downloadIcon'] ||
      slots['showUploadList.removeIcon'] ||
      slots['showUploadList.previewIcon'] ||
      slots['showUploadList.extra'] ||
      typeof showUploadList === 'object';
    const showUploadListConfig = getConfig(showUploadList);
    const supportPlaceholderConfig =
      slots['placeholder.title'] ||
      slots['placeholder.description'] ||
      slots['placeholder.icon'] ||
      typeof placeholder === 'object';
    const placeholderConfig = getConfig(placeholder);
    const showUploadListShowPreviewIconFunction = useFunction(
      showUploadListConfig.showPreviewIcon
    );
    const showUploadListShowRemoveIconFunction = useFunction(
      showUploadListConfig.showRemoveIcon
    );
    const showUploadListShowDownloadIconFunction = useFunction(
      showUploadListConfig.showDownloadIcon
    );
    const { token } = theme.useToken();

    const beforeUploadFunction = useFunction(beforeUpload);
    const customRequestFunction = useFunction(customRequest);
    const progressFormatFunction = useFunction(progress?.format);
    const previewFileFunction = useFunction(previewFile);
    const isImageUrlFunction = useFunction(isImageUrl);
    const itemRenderFunction = useFunction(itemRender);
    const iconRenderFunction = useFunction(iconRender);
    const placeholderFunction = useFunction(placeholder, true);
    const getDropContainerFunction = useFunction(getDropContainer);
    const dataFunction = useFunction(data);
    const uploadingRef = useRef(false);
    const [fileList, setFileList] = useState<
      (
        | (FileData & {
            uid?: string;
          })
        | UploadFile
      )[]
    >(items);

    useEffect(() => {
      setFileList(items);
    }, [items]);
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
    const targets = useTargets(children);

    return (
      <>
        <div style={{ display: 'none' }}>
          {targets.length > 0 ? null : children}
        </div>
        <XAttachments
          {...props}
          imageProps={{
            ...imageProps,
            preview: supportPreview
              ? (omitUndefinedProps({
                  ...previewConfig,
                  getContainer: getContainerFunction,
                  toolbarRender: slots['imageProps.preview.toolbarRender']
                    ? renderParamsSlot({
                        slots,
                        setSlotParams,
                        key: 'imageProps.preview.toolbarRender',
                      })
                    : previewToolbarRenderFunction,
                  imageRender: slots['imageProps.preview.imageRender']
                    ? renderParamsSlot({
                        slots,
                        setSlotParams,
                        key: 'imageProps.preview.imageRender',
                      })
                    : previewImageRenderFunction,

                  ...(slots['imageProps.preview.mask'] ||
                  Reflect.has(previewConfig, 'mask')
                    ? {
                        mask: slots['imageProps.preview.mask'] ? (
                          <ReactSlot slot={slots['imageProps.preview.mask']} />
                        ) : (
                          previewConfig.mask
                        ),
                      }
                    : {}),
                  closeIcon: slots['imageProps.preview.closeIcon'] ? (
                    <ReactSlot slot={slots['imageProps.preview.closeIcon']} />
                  ) : (
                    previewConfig.closeIcon
                  ),
                }) as NonNullable<FileCardProps['imageProps']>['preview'])
              : false,
            placeholder: slots['imageProps.placeholder'] ? (
              <ReactSlot slot={slots['imageProps.placeholder']} />
            ) : (
              imageProps?.placeholder
            ),
            wrapperStyle: {
              width: '100%',
              height: '100%',
              ...imageProps?.wrapperStyle,
            },
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: token.borderRadius,
              ...imageProps?.style,
            },
          }}
          getDropContainer={getDropContainerFunction}
          placeholder={
            slots.placeholder
              ? renderParamsSlot({ slots, setSlotParams, key: 'placeholder' })
              : supportPlaceholderConfig
                ? (...args) => {
                    return {
                      ...placeholderConfig,
                      icon: slots['placeholder.icon']
                        ? renderParamsSlot({
                            slots,
                            setSlotParams,
                            key: 'placeholder.icon',
                          })?.(...args)
                        : placeholderConfig.icon,
                      title: slots['placeholder.title']
                        ? renderParamsSlot({
                            slots,
                            setSlotParams,
                            key: 'placeholder.title',
                          })?.(...args)
                        : placeholderConfig.title,
                      description: slots['placeholder.description']
                        ? renderParamsSlot({
                            slots,
                            setSlotParams,
                            key: 'placeholder.description',
                          })?.(...args)
                        : placeholderConfig.description,
                    };
                  }
                : placeholderFunction || placeholder
          }
          items={validFileList}
          data={dataFunction || data}
          previewFile={previewFileFunction}
          isImageUrl={isImageUrlFunction}
          itemRender={
            slots.itemRender
              ? renderParamsSlot({ slots, setSlotParams, key: 'itemRender' })
              : itemRenderFunction
          }
          iconRender={
            slots.iconRender
              ? renderParamsSlot({ slots, setSlotParams, key: 'iconRender' })
              : iconRenderFunction
          }
          maxCount={maxCount}
          // onRemove={(file) => {
          //   if (uploadingRef.current) {
          //     return;
          //   }
          //   onRemove?.(file);
          //   const index = validFileList.findIndex((v) => v.uid === file.uid);
          //   const newFileList = fileList.slice() as FileData[];
          //   newFileList.splice(index, 1);
          //   onValueChange?.(newFileList);
          //   onChange?.(newFileList.map((v) => v.path));
          // }}
          onChange={async (info) => {
            const file = info.file;
            const files = info.fileList;
            // remove
            const index = validFileList.findIndex((v) => v.uid === file.uid);

            if (index !== -1) {
              if (uploadingRef.current) {
                return;
              }
              onRemove?.(file);
              const newFileList = fileList.slice() as FileData[];
              newFileList.splice(index, 1);
              onValueChange?.(newFileList);
              onChange?.(newFileList.map((v) => v.path));
            } else {
              // add
              if (beforeUploadFunction) {
                if (!(await beforeUploadFunction(file, files))) {
                  return;
                }
              }
              if (uploadingRef.current) {
                return;
              }
              uploadingRef.current = true;
              let validFiles = files.filter((v) => v.status !== 'done');

              if (maxCount === 1) {
                validFiles = validFiles.slice(0, 1);
              } else if (validFiles.length === 0) {
                uploadingRef.current = false;
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
                await upload(validFiles.map((f) => f.originFileObj as RcFile))
              )
                .filter(Boolean)
                .map((v, i) => {
                  return {
                    ...v,
                    uid: tempFileList[i].uid,
                  };
                }) as FileData[];
              const mergedFileList =
                maxCount === 1
                  ? fileDataList
                  : ([...lastFileList, ...fileDataList] as FileData[]);

              uploadingRef.current = false;

              setFileList(mergedFileList);
              onValueChange?.(mergedFileList);
              onChange?.(mergedFileList.map((v) => v.path));
            }
          }}
          customRequest={customRequestFunction || noop}
          progress={
            progress
              ? {
                  ...progress,
                  format: progressFormatFunction,
                }
              : progress
          }
          showUploadList={
            supportShowUploadListConfig
              ? {
                  ...showUploadListConfig,
                  showDownloadIcon:
                    showUploadListShowDownloadIconFunction ||
                    showUploadListConfig.showDownloadIcon,
                  showRemoveIcon:
                    showUploadListShowRemoveIconFunction ||
                    showUploadListConfig.showRemoveIcon,
                  showPreviewIcon:
                    showUploadListShowPreviewIconFunction ||
                    showUploadListConfig.showPreviewIcon,
                  downloadIcon: slots['showUploadList.downloadIcon']
                    ? renderParamsSlot({
                        slots,
                        setSlotParams,
                        key: 'showUploadList.downloadIcon',
                      })
                    : showUploadListConfig.downloadIcon,
                  removeIcon: slots['showUploadList.removeIcon']
                    ? renderParamsSlot({
                        slots,
                        setSlotParams,
                        key: 'showUploadList.removeIcon',
                      })
                    : showUploadListConfig.removeIcon,
                  previewIcon: slots['showUploadList.previewIcon']
                    ? renderParamsSlot({
                        slots,
                        setSlotParams,
                        key: 'showUploadList.previewIcon',
                      })
                    : showUploadListConfig.previewIcon,
                  extra: slots['showUploadList.extra']
                    ? renderParamsSlot({
                        slots,
                        setSlotParams,
                        key: 'showUploadList.extra',
                      })
                    : showUploadListConfig.extra,
                }
              : showUploadList
          }
        >
          {targets.length > 0 ? children : undefined}
        </XAttachments>
      </>
    );
  }
);

export default Attachments;
