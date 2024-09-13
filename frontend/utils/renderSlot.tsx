import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';

export function renderSlot(el?: HTMLElement, options?: { clone?: boolean }) {
  return el ? <ReactSlot slot={el} clone={options?.clone} /> : null;
}
