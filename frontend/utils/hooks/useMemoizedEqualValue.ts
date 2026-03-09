import { useMemo, useRef } from 'react';
import { isEqual } from 'lodash-es';

export function useMemoizedEqualValue<T>(prop: T): T {
  const propRef = useRef<T | undefined>(undefined);

  return useMemo(() => {
    if (isEqual(prop, propRef.current)) {
      return propRef.current as T;
    }
    propRef.current = prop;
    return prop;
  }, [prop]);
}
