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
              <React.Fragment key={i}>
                {renderSlot(target, {
                  clone: true,
                  params: args,
                  forceClone: options?.forceClone ?? true,
                })}
              </React.Fragment>
            );
          });
        }
        return (
          <>
            {renderSlot(slots[key], {
              clone: true,
              params: args,
              forceClone: options?.forceClone ?? true,
            })}
          </>
        );
      }
    : undefined;
}
