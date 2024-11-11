import { createContext, useContext } from 'react';

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
