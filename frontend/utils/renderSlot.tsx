import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';

export interface RenderSlotOptions {
  clone?: boolean;
}

export function renderSlot(el?: HTMLElement, options?: RenderSlotOptions) {
  return el ? <ReactSlot slot={el} clone={options?.clone} /> : null;
}
