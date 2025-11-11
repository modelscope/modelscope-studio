import { useCallback, useEffect, useRef, useState } from 'react';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';

export function useValueChange(options: {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
}) {
  const { value: valueProp, onValueChange } = options;
  const [typing, setTyping] = useState(false);
  const [displayValue, setDisplayValue] = useState(valueProp);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onValueChangeMemoized = useMemoizedFn(onValueChange);

  const setValue = useCallback(
    (value: string | undefined) => {
      typingTimerRef.current && clearTimeout(typingTimerRef.current);
      setTyping(true);
      typingTimerRef.current = setTimeout(() => {
        setTyping(false);
      }, 100);
      onValueChangeMemoized(value);
    },
    [onValueChangeMemoized]
  );

  useEffect(() => {
    // if not typing, use the cache value
    if (!typing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue(valueProp);
    }
  }, [typing, valueProp]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, []);
  return [displayValue, setValue] as const;
}
