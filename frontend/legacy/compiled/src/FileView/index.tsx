import React from 'react';
import { FileOutlined } from '@ant-design/icons';
import type { ImageProps } from 'antd';
import { Image as AntdImage } from 'antd';

import { defineComponent } from '../defineComponent';

import { usePreview } from './hooks/usePreview';
import Pdf from './Pdf';

import './index.less';

const Image: React.FC<ImageProps> = ({ preview = true, ...props }) => {
  const previewConfig = usePreview();
  return (
    <div style={{ width: '100%' }}>
      <AntdImage
        preview={preview ? previewConfig : false}
        style={{ maxWidth: '100%', width: 'auto' }}
        {...props}
      />
    </div>
  );
};
const Video: React.FC<React.VideoHTMLAttributes<HTMLVideoElement>> = (
  props
) => {
  return (
    <video
      style={{
        maxWidth: '100%',
      }}
      preload="auto"
      controls
      {...props}
    >
      <track kind="captions" />
    </video>
  );
};
const Audio: React.FC<React.AudioHTMLAttributes<HTMLAudioElement>> = (
  props
) => {
  return (
    <audio
      preload="metadata"
      controls
      {...props}
      style={{ maxWidth: '100%', ...props.style }}
    />
  );
};

const Link: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    filename?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }
> = (props) => {
  const { filename, href, icon = <FileOutlined />, disabled, ...args } = props;
  if (disabled) {
    return (
      <span>
        <span style={{ marginRight: 2 }}>{icon}</span>
        {filename || href}
      </span>
    );
  }
  return (
    <a
      {...args}
      target="_blank"
      rel="noreferrer"
      href={href}
      download={filename}
    >
      <span style={{ marginRight: 2 }}>{icon}</span>
      {filename || href}
    </a>
  );
};
export type FileViewProps = {
  url?: string;
  preview?: boolean;
  type?: 'image' | 'video' | 'audio' | 'pdf' | 'link';
} & (
  | ({
      type: 'image';
    } & Parameters<typeof Image>[0])
  | ({
      type: 'video';
    } & Parameters<typeof Video>[0])
  | ({
      type: 'audio';
    } & Parameters<typeof Audio>[0])
  | ({
      type: 'pdf';
    } & Parameters<typeof Pdf>[0])
  | ({
      type?: 'link';
    } & Parameters<typeof Link>[0])
);

export const FileView = defineComponent<FileViewProps>((props) => {
  const { url, type, ...args } = props;
  switch (type) {
    case 'image':
      return <Image src={url} {...(args as any)} />;
    case 'video':
      return <Video src={url} {...(args as any)} />;
    case 'audio':
      return <Audio src={url} {...(args as any)} />;
    case 'pdf':
      return <Pdf src={url} {...(args as any)} />;
    case 'link':
    default:
      return <Link href={url} {...(args as any)} />;
  }
});
