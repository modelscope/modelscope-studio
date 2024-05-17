import { useEffect, useState } from 'react';
import type { ImageProps } from 'antd';

export function usePreview(): ImageProps['preview'] {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (visible) {
      document.body.classList.add('ms-preview-container');
    } else {
      document.body.classList.remove('ms-preview-container');
    }
  }, [visible]);
  return {
    visible,
    onVisibleChange: (value) => {
      setVisible(value);
    },
  };
}
