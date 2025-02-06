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

export const SuggestionContext = createContext<{
  elRef?: React.ForwardedRef<HTMLElement>;
  [key: PropertyKey]: any;
} | null>(null);

export const useSuggestionContext = () => useContext(SuggestionContext);

export interface ContextPropsContextValue {
  params?: any[];
  initial: boolean;
  ctx: Record<PropertyKey, any> | null;
  forceClone: boolean;
}

export const ContextPropsContext = createContext<ContextPropsContextValue>({
  initial: false,
  ctx: null,
  forceClone: false,
});

export const ContextPropsProvider: React.FC<
  Partial<ContextPropsContextValue> & {
    children?: React.ReactNode;
  }
> = ({ params, ctx, forceClone, children }) => {
  const prevCtxValueRef = useRef<ContextPropsContextValue>({
    params,
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
            params,
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
