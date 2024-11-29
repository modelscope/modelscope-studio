import { useMemo } from 'react';

import { createFunction } from '../createFunction';

export function useFunction<T extends (...args: any[]) => any>(
  target: any,
  plainText?: boolean
) {
  return useMemo(() => {
    return createFunction<T>(target, plainText);
  }, [target, plainText]);
}
