import { useEffect, useRef, useState } from 'react';

export interface UseValueChangeProps<T, P> {
  value: T;
  onValueChange: (value: P) => void;
}

export function useValueChange<T, P>({
  value,
  onValueChange,
}: UseValueChangeProps<T, P>) {
  const [mergedValue, setMergedValue] = useState<T>(value);
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const mergedValueRef = useRef<T>(mergedValue);
  mergedValueRef.current = mergedValue;
  useEffect(() => {
    onValueChangeRef.current(mergedValue as unknown as P);
  }, [mergedValue]);

  useEffect(() => {
    if (value !== mergedValueRef.current) {
      setMergedValue(value);
    }
  }, [value]);

  return [mergedValue, setMergedValue] as const;
}
