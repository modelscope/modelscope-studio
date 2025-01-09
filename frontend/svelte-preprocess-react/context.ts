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

export const RenderParamsContext = createContext<{
  value: any[];
  initial: boolean;
  ctx: Record<PropertyKey, any>;
}>({
  initial: false,
  value: [],
  ctx: {},
});

export const RenderParamsProvider: React.FC<{
  value?: any[];
  ctx?: Record<PropertyKey, any>;
  children: React.ReactNode;
}> = ({ value = [], ctx = {}, children }) => {
  const prevCtxValueRef = useRef<{
    value: any[];
    ctx: Record<PropertyKey, any>;
    initial: boolean;
  }>({
    initial: true,
    value,
    ctx,
  });
  return React.createElement(
    RenderParamsContext.Provider,
    {
      value: useMemo(() => {
        let hasChanged = false;

        if (!isEqual(prevCtxValueRef.current.value, value)) {
          hasChanged = true;
        }
        if (!isEqual(prevCtxValueRef.current.ctx, ctx)) {
          hasChanged = true;
        }
        if (hasChanged) {
          prevCtxValueRef.current = {
            value,
            ctx,
            initial: true,
          };
          return prevCtxValueRef.current;
        }
        return prevCtxValueRef.current;
      }, [ctx, value]),
    },
    children
  );
};

export const useRenderParamsContext = () => useContext(RenderParamsContext);
