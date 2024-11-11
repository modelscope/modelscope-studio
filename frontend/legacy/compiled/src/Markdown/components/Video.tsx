import type { Components } from 'react-markdown';

import { FileView } from '../../FileView';

export const Video: Components['video'] = (props) => {
  return <FileView type="video" {...props} url={props.src} />;
};
