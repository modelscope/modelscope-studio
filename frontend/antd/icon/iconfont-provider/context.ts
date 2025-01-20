import { createContext, useContext } from 'react';
import type { createFromIconfontCN } from '@ant-design/icons';

export const IconFontContext = createContext<ReturnType<
  typeof createFromIconfontCN
> | null>(null);

export const useIconFontContext = () => {
  return useContext(IconFontContext);
};
