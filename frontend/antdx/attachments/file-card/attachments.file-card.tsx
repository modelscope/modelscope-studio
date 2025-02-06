import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { Attachments as XAttachments } from '@ant-design/x';
import type { FileListCardProps } from '@ant-design/x/es/attachments/FileList/FileListCard';

export const AttachmentsFileCard = sveltify<FileListCardProps>((props) => {
  return <XAttachments.FileCard {...props} />;
});

export default AttachmentsFileCard;
