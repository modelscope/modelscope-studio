import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FileData } from '@gradio/client';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Upload as AUpload, type UploadFile } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { noop } from 'lodash-es';

const isUploadFile = (file: FileData | UploadFile): file is UploadFile => {
  return !!(file as UploadFile).name;
};

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const Upload = sveltify<
  Omit<GetProps<typeof AUpload>, 'fileList' | 'onChange'> & {
    onValueChange?: (value: FileData[]) => void;
    onChange?: (value: string[]) => void;
    upload: (files: RcFile[]) => Promise<(FileData | null)[]>;
    fileList: FileData[];
    setSlotParams: SetSlotParams;
  },
  [
    'showUploadList.extra',
    'showUploadList.previewIcon',
    'showUploadList.removeIcon',
    'showUploadList.downloadIcon',
    'iconRender',
    'itemRender',
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
    maxCount,
    fileList: fileListProp,
    setSlotParams,
    ...props
  }) => {
    const supportShowUploadListConfig =
      slots['showUploadList.downloadIcon'] ||
      slots['showUploadList.removeIcon'] ||
      slots['showUploadList.previewIcon'] ||
      slots['showUploadList.extra'] ||
      typeof showUploadList === 'object';
    const showUploadListConfig = getConfig(showUploadList);
    const showUploadListShowPreviewIconFunction = useFunction(
      showUploadListConfig.showPreviewIcon
    );
    const showUploadListShowRemoveIconFunction = useFunction(
      showUploadListConfig.showRemoveIcon
    );
    const showUploadListShowDownloadIconFunction = useFunction(
      showUploadListConfig.showDownloadIcon
    );
    const beforeUploadFunction = useFunction(beforeUpload);
    const customRequestFunction = useFunction(customRequest);
    const progressFormatFunction = useFunction(progress?.format);
    const previewFileFunction = useFunction(previewFile);
    const isImageUrlFunction = useFunction(isImageUrl);
    const itemRenderFunction = useFunction(itemRender);
    const iconRenderFunction = useFunction(iconRender);
    const dataFunction = useFunction(data);
    const uploadingRef = useRef(false);
    const [fileList, setFileList] = useState<
      (
        | (FileData & {
            uid?: string;
          })
        | UploadFile
      )[]
    >(fileListProp);
    useEffect(() => {
      setFileList(fileListProp);
    }, [fileListProp]);
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
    return (
      <AUpload
        {...props}
        fileList={validFileList}
        data={dataFunction || data}
        previewFile={previewFileFunction}
        isImageUrl={isImageUrlFunction}
        maxCount={maxCount}
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
        customRequest={customRequestFunction || noop}
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
                percent: 99,
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
      />
    );
  }
);

export default Upload;
