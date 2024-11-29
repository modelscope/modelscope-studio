import { useCallback, useRef } from 'react';

export function useMemoizedFn<T extends (...args: any) => any>(fn?: T): T {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args: any[]) => fnRef.current?.(...args)) as T, []);
}
