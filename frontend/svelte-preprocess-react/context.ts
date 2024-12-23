import React, { createContext, useContext, useMemo, useRef } from 'react';
import { isEqual } from 'lodash-es';

export const FormItemContext = createContext<{
  value?: any;
  onChange?: (...args: any[]) => void;
  [key: PropertyKey]: any;
} | null>(null);

export const useFormItemContext = () => useContext(FormItemContext);

export const AutoCompleteContext = createContext<{
  elRef?: React.ForwardedRef<HTMLElement>;
  [key: PropertyKey]: any;
}>({});

export const useAutoCompleteContext = () => useContext(AutoCompleteContext);

export const RenderParamsContext = createContext<any[]>([]);

export const RenderParamsProvider: React.FC<{
  value: any[];
  children: React.ReactNode;
}> = ({ value, children }) => {
  const prevValueRef = useRef<typeof value>(value);
  return React.createElement(
    RenderParamsContext.Provider,
    {
      value: useMemo(() => {
        if (isEqual(prevValueRef.current, value)) {
          return prevValueRef.current;
        }
        prevValueRef.current = value;
        return prevValueRef.current;
      }, [value]),
    },
    children
  );
};

export const useRenderParamsContext = () => useContext(RenderParamsContext);
