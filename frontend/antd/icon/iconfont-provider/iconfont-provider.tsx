import { sveltify } from '@svelte-preprocess-react';
import React, { useMemo, useRef } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import type { CustomIconOptions } from '@ant-design/icons/es/components/IconFont';
import { isEqual } from 'lodash-es';

import { IconFontContext } from './context';

export const Icon = sveltify<
  CustomIconOptions & {
    children?: React.ReactNode;
  }
>(({ children, extraCommonProps, scriptUrl }) => {
  const prevRef = useRef<
    CustomIconOptions & {
      iconfont?: ReturnType<typeof createFromIconfontCN>;
    }
  >({});
  const IconFont = useMemo(() => {
    if (
      prevRef.current.iconfont &&
      isEqual(prevRef.current.scriptUrl, scriptUrl) &&
      isEqual(prevRef.current.extraCommonProps, extraCommonProps)
    ) {
      return prevRef.current.iconfont;
    }
    prevRef.current = {
      scriptUrl,
      extraCommonProps,
      iconfont: createFromIconfontCN({
        scriptUrl,
        extraCommonProps,
      }),
    };
    return prevRef.current.iconfont;
  }, [extraCommonProps, scriptUrl]);
  return (
    <IconFontContext.Provider value={IconFont || null}>
      {children}
    </IconFontContext.Provider>
  );
});

export default Icon;
