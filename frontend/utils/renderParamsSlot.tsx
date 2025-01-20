import { ContextPropsProvider } from '@svelte-preprocess-react/context';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';

import { renderSlot, type RenderSlotOptions } from './renderSlot';

export function renderParamsSlot(
  {
    key,
    slots,
  }: {
    key: string;
    /**
     * @deprecated
     */
    setSlotParams?: SetSlotParams;
    slots: Record<string, HTMLElement>;
  },
  options?: RenderSlotOptions & {
    forceClone?: boolean;
  }
) {
  return slots[key]
    ? (...args: any[]) => {
        // setSlotParams(key, args);
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
