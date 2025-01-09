import { sveltify } from '@svelte-preprocess-react';
import React from 'react';

export const Text = sveltify<{
  value?: string;
}>(({ value }) => {
  return <>{value}</>;
});

export default Text;
