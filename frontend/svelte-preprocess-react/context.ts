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

export const SuggestionOpenContext = createContext(false);
export const useSuggestionOpenContext = () => useContext(SuggestionOpenContext);

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

export const useContextPropsContext = () => useContext(ContextPropsContext);

const mergeCtx = (
  ctx1?: Record<PropertyKey, any> | null,
  ctx2?: Record<PropertyKey, any> | null
) => {
  if (!ctx1 && !ctx2) {
    return null;
  }

  return {
    ...(ctx1 || {}),
    ...(ctx2 || {}),
  };
};

export const ContextPropsProvider: React.FC<
  Partial<ContextPropsContextValue> & {
    children?: React.ReactNode;
    mergeContext?: boolean;
  }
> = ({ params, ctx, mergeContext = true, forceClone, children }) => {
  const contextProps = useContextPropsContext();
  const { forceClone: pForceClone } = contextProps;
  let pCtx = contextProps.ctx;
  pCtx = mergeContext ? pCtx : null;
  const mergedCtx = useMemo(() => {
    return mergeCtx(pCtx, ctx);
  }, [ctx, pCtx]);
  const prevCtxValueRef = useRef<ContextPropsContextValue>({
    params,
    ctx: mergedCtx,
    initial: true,
    forceClone: pForceClone || forceClone || false,
  });
  const prevParamsStrRef = useRef<string>();

  return React.createElement(
    ContextPropsContext.Provider,
    {
      value: useMemo(() => {
        let hasChanged = false;
        try {
          const paramsStr = JSON.stringify(params);
          if (prevParamsStrRef.current !== paramsStr) {
            prevParamsStrRef.current = paramsStr;
            hasChanged = true;
          }
        } catch {
          //
        }
        if (!hasChanged && !isEqual(prevCtxValueRef.current.params, params)) {
          hasChanged = true;
        }
        if (!hasChanged && !isEqual(prevCtxValueRef.current.ctx, mergedCtx)) {
          hasChanged = true;
        }

        if (hasChanged) {
          prevCtxValueRef.current = {
            params,
            ctx: mergedCtx,
            initial: true,
            forceClone: pForceClone || forceClone || false,
          };
        }
        return prevCtxValueRef.current;
      }, [params, mergedCtx, pForceClone, forceClone]),
    },
    children
  );
};
