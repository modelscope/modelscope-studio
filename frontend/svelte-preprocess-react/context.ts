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
} | null>(null);

export const useAutoCompleteContext = () => useContext(AutoCompleteContext);

export interface ContextPropsContextValue {
  params: any[];
  initial: boolean;
  ctx: Record<PropertyKey, any> | null;
  forceClone: boolean;
}

export const ContextPropsContext = createContext<ContextPropsContextValue>({
  initial: false,
  params: [],
  ctx: null,
  forceClone: false,
});

export const ContextPropsProvider: React.FC<{
  params?: any[];
  ctx?: Record<PropertyKey, any>;
  children?: React.ReactNode;
  forceClone?: boolean;
}> = ({ params, ctx, forceClone, children }) => {
  const prevCtxValueRef = useRef<ContextPropsContextValue>({
    params: params || [],
    ctx: ctx || null,
    initial: true,
    forceClone: forceClone || false,
  });
  return React.createElement(
    ContextPropsContext.Provider,
    {
      value: useMemo(() => {
        let hasChanged = false;
        if (!isEqual(prevCtxValueRef.current.params, params)) {
          hasChanged = true;
        }
        if (!isEqual(prevCtxValueRef.current.ctx, ctx)) {
          hasChanged = true;
        }
        if (hasChanged) {
          prevCtxValueRef.current = {
            params: params || [],
            ctx: ctx || null,
            initial: true,
            forceClone: forceClone || false,
          };
          return prevCtxValueRef.current;
        }
        return prevCtxValueRef.current;
      }, [ctx, forceClone, params]),
    },
    children
  );
};

export const useContextPropsContext = () => useContext(ContextPropsContext);
