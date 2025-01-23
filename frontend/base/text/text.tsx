import { sveltify } from '@svelte-preprocess-react';
import React from 'react';

export const Text = sveltify<{
  value?: string;
}>(({ value }) => {
  return <>{value || <span />}</>;
});

export default Text;
