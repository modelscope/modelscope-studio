import type { Components } from 'react-markdown';
import type { ImageProps } from 'antd';

import { FileView } from '../../FileView';
import { useMarkdownContext } from '../context';

export const Image: Components['img'] = (props) => {
  const { preview } = useMarkdownContext();
  return (
    <FileView
      type="image"
      {...(props as ImageProps)}
      url={props.src}
      preview={preview}
    />
  );
};
