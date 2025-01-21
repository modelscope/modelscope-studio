import { ContextPropsProvider } from '@svelte-preprocess-react/context';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import React from 'react';

import { renderSlot, type RenderSlotOptions } from './renderSlot';

export function renderParamsSlot(
  {
    key,
    slots,
    targets,
  }: {
    key: string;
    /**
     * @deprecated
     */
    setSlotParams?: SetSlotParams;
    slots: Record<string, HTMLElement>;
    /**
     * multiple targets
     */
    targets?: HTMLElement[];
  },
  options?: RenderSlotOptions & {
    forceClone?: boolean;
  }
) {
  return slots[key]
    ? (...args: any[]) => {
        // setSlotParams(key, args);
        if (targets) {
          return targets.map((target, i) => {
            return (
              <ContextPropsProvider
                key={i}
                params={args}
                forceClone={options?.forceClone ?? true}
              >
                {renderSlot(target, { clone: true, ...options })}
              </ContextPropsProvider>
            );
          });
        }
        return (
          <ContextPropsProvider
            params={args}
            forceClone={options?.forceClone ?? true}
          >
            {renderSlot(slots[key], { clone: true, ...options })}
          </ContextPropsProvider>
        );
      }
    : undefined;
}
