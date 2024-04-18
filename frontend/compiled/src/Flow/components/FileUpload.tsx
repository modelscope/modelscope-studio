import React, { useEffect, useRef, useState } from 'react';
import { FileOutlined } from '@ant-design/icons';
import { Upload, type UploadProps } from 'antd';

import { useFlow } from '../FlowContext';
import { i18n } from '../i18n';
import { UploadFile } from '../type';

export interface FileUploadProps extends Omit<UploadProps, 'onChange'> {
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [fileList, setFileList] = useState<
    NonNullable<UploadProps['fileList']>
  >([]);
  const uploadingRef = useRef(false);
  const { onUpload, locale } = useFlow();
  useEffect(() => {
    setFileList(
      value?.map((file) => ({
        ...file,
        uid: file.url,
        status: 'done',
      })) || []
    );
  }, [value]);
  return (
    <Upload.Dragger
      {...props}
      fileList={fileList}
      customRequest={() => {}}
      onRemove={() => {
        if (uploadingRef.current) {
          return false;
        }
      }}
      onChange={async (info) => {
        if (uploadingRef.current || !onUpload) {
          return;
        }
        uploadingRef.current = true;

        const results = await onUpload(
          info.fileList
            .filter((file) => file.status === 'uploading')
            .map((file) => file.originFileObj) as File[]
        );

        onChange?.([
          ...(value?.filter((file) =>
            info.fileList.some((f) => f.url === file.url)
          ) || []),
          ...results,
        ]);
        uploadingRef.current = false;
      }}
    >
      <p className="ant-upload-drag-icon">
        <FileOutlined />
      </p>
      <p className="ant-upload-text">{i18n('upload.drop_file', locale)}</p>
    </Upload.Dragger>
  );
};
