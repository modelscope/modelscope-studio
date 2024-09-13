import { sveltify } from '@svelte-preprocess-react';
import React from 'react';

export const Fragment = sveltify<{
  children?: React.ReactNode;
}>(({ children }) => {
  return <>{children}</>;
});

export default Fragment;
