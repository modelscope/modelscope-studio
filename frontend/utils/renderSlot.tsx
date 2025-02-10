import { ContextPropsProvider } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';

import { patchSlotProps } from './patchProps';

export interface RenderSlotOptions {
  clone?: boolean;
  forceClone?: boolean;
  params?: any[];
}

export function renderSlot(el?: HTMLElement, options?: RenderSlotOptions) {
  return el
    ? patchSlotProps((props) => (
        <ContextPropsProvider
          forceClone={options?.forceClone}
          params={options?.params}
        >
          <ReactSlot slot={el} clone={options?.clone} {...props} />
        </ContextPropsProvider>
      ))
    : null;
}
