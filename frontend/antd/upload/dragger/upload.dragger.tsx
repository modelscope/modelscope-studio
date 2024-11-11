import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useMemo } from 'react';
import type { FileData } from '@gradio/client';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { type GetProps, Upload as AUpload } from 'antd';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}
export const UploadDragger = sveltify<
  Omit<GetProps<typeof AUpload.Dragger>, 'fileList' | 'onChange'> & {
    onValueChange?: (value: FileData[]) => void;
    onChange?: (value: string[]) => void;
    upload: (files: File[]) => Promise<(FileData | null)[]>;
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
    fileList,
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
      <AUpload.Dragger
        {...props}
        fileList={validFileList}
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

export default UploadDragger;
