import type { Components } from 'react-markdown';

import { FileView } from '../../FileView';

export const Audio: Components['audio'] = (props) => {
  return <FileView type="audio" {...props} url={props.src} />;
};
