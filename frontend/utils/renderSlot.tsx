import { ContextPropsProvider } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';

export interface RenderSlotOptions {
  clone?: boolean;
  forceClone?: boolean;
}

export function renderSlot(el?: HTMLElement, options?: RenderSlotOptions) {
  return el ? (
    <ContextPropsProvider forceClone={options?.forceClone}>
      <ReactSlot slot={el} clone={options?.clone} />
    </ContextPropsProvider>
  ) : null;
}
