import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import { useMemo } from 'react';
import type { FileData } from '@gradio/client';
import { useFunction } from '@utils/hooks/useFunction';
import { type GetProps, Upload as AUpload } from 'antd';

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
    upload: (files: File[]) => Promise<(FileData | null)[]>;
    fileList: FileData[];
  },
  [
    'showUploadList.extra',
    'showUploadList.previewIcon',
    'showUploadList.removeIcon',
    'showUploadList.downloadIcon',
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
    fileList,
    ...props
  }) => {
    const supportShowUploadListConfig =
      slots['showUploadList.downloadIcon'] ||
      slots['showUploadList.removeIcon'] ||
      slots['showUploadList.previewIcon'] ||
      slots['showUploadList.extra'] ||
      typeof showUploadList === 'object';
    const showUploadListConfig = getConfig(showUploadList);
    const beforeUploadFunction = useFunction(beforeUpload);
    const customRequestFunction = useFunction(customRequest);
    const progressFormatFunction = useFunction(progress?.format);
    const previewFileFunction = useFunction(previewFile);
    const isImageUrlFunction = useFunction(isImageUrl);
    const itemRenderFunction = useFunction(itemRender);
    const iconRenderFunction = useFunction(iconRender);
    const dataFunction = useFunction(data);
    const validFileList = useMemo(() => {
      return (
        fileList?.map((file) => ({
          ...file,
          name: file.orig_name || file.path,
          uid: file.url || file.path,
          status: 'done' as const,
        })) || []
      );
    }, [fileList]);
    return (
      <AUpload
        {...props}
        fileList={validFileList}
        data={dataFunction || data}
        previewFile={previewFileFunction}
        isImageUrl={isImageUrlFunction}
        itemRender={itemRenderFunction}
        iconRender={iconRenderFunction}
        onRemove={(file) => {
          onRemove?.(file);
          const index = validFileList.findIndex((v) => v.uid === file.uid);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          onValueChange?.(newFileList);
          onChange?.(newFileList.map((v) => v.path));
        }}
        beforeUpload={async (file, files) => {
          if (beforeUploadFunction) {
            if (!(await beforeUploadFunction(file, files))) {
              return false;
            }
          }
          const fileDataList = (await upload([file])).filter(
            (v) => v
          ) as FileData[];

          onValueChange?.([...fileList, ...fileDataList]);
          onChange?.([
            ...fileList.map((v) => v.path),
            ...fileDataList.map((v) => v.path),
          ]);
          return false;
        }}
        customRequest={customRequestFunction}
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
                downloadIcon: slots['showUploadList.downloadIcon'] ? (
                  <ReactSlot slot={slots['showUploadList.downloadIcon']} />
                ) : (
                  showUploadListConfig.downloadIcon
                ),
                removeIcon: slots['showUploadList.removeIcon'] ? (
                  <ReactSlot slot={slots['showUploadList.removeIcon']} />
                ) : (
                  showUploadListConfig.removeIcon
                ),
                previewIcon: slots['showUploadList.previewIcon'] ? (
                  <ReactSlot slot={slots['showUploadList.previewIcon']} />
                ) : (
                  showUploadListConfig.previewIcon
                ),
                extra: slots['showUploadList.extra'] ? (
                  <ReactSlot slot={slots['showUploadList.extra']} />
                ) : (
                  showUploadListConfig.extra
                ),
              }
            : showUploadList
        }
      />
    );
  }
);

export default Upload;
