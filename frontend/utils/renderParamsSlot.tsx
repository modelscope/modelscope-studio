import { RenderParamsProvider } from '@svelte-preprocess-react/context';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';

import { renderSlot, type RenderSlotOptions } from './renderSlot';

export function renderParamsSlot(
  {
    key,
    setSlotParams,
    slots,
  }: {
    key: string;
    setSlotParams: SetSlotParams;
    slots: Record<string, HTMLElement>;
  },
  options?: RenderSlotOptions
) {
  return slots[key]
    ? (...args: any[]) => {
        setSlotParams(key, args);
        return (
          <RenderParamsProvider value={args}>
            {renderSlot(slots[key], { clone: true, ...options })}
          </RenderParamsProvider>
        );
      }
    : undefined;
}
