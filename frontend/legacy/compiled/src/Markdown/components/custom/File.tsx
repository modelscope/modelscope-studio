import React from 'react';
import type { Components } from 'react-markdown';
import {
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';

import { FileView } from '../../../FileView';
import { getURLFileExtension } from '../../../utils';
import { useCustomProps } from '../../hooks/useCustomProps';

export interface FileProps extends Record<string, any> {
  title?: string;
  src?: string;
  type?: string;
  children: string[];
  height?: number;
  viewable?: string;
  width?: number;
}

export const File: Components['file'] = (nodeProps) => {
  const [
    { title = '', src, children = [], viewable: _viewable, type, ...props },
  ] = useCustomProps(nodeProps);
  const viewable = typeof _viewable === 'string';
  let url = src || children[0];
  if (
    React.isValidElement<{ node: any; href: string }>(url) &&
    url.props.node.tagName === 'a'
  ) {
    url = url.props.href;
  }
  if (typeof url !== 'string') {
    return <>{url}</>;
  }
  let icon = <FileOutlined />;
  let view: React.ReactNode = null;
  if (viewable) {
    const isFiletype = (filetype: string | string[]) =>
      (Array.isArray(filetype) ? filetype : [filetype]).some(
        (item) =>
          (title && title.endsWith(`.${item}`)) ||
          (!title && getURLFileExtension(url) === item)
      );
    if (type === 'pdf' || isFiletype('pdf')) {
      icon = <FilePdfOutlined />;
      view = <FileView {...props} type="pdf" url={url} />;
    } else if (
      type === 'image' ||
      isFiletype(['png', 'jpg', 'jpeg', 'webp', 'gif'])
    ) {
      icon = <FileImageOutlined />;
      view = <FileView {...props} type="image" url={url} alt={title} />;
    }
  }

  return (
    <>
      <FileView type="link" filename={title || url} url={url} icon={icon} />
      {view}
    </>
  );
};
