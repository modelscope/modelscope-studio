import { sveltify } from '@svelte-preprocess-react';
import { RenderParamsProvider } from '@svelte-preprocess-react/context';
import type React from 'react';
import { useMemo } from 'react';
import { merge } from 'lodash-es';

export interface EachProps {
  value?: any[];
  context_value?: Record<PropertyKey, any>;
  children?: React.ReactNode;
}
// 在使用时需要判断是否是 each 组件，然后执行这个方法，不需要 subSlotIndex 了

const Item: React.FC<{
  value?: any;
  context_value?: Record<PropertyKey, any>;
  children?: React.ReactNode;
}> = ({ value, children, context_value }) => {
  const resolvedValue = useMemo(() => {
    return typeof value !== 'object' || Array.isArray(value)
      ? { value }
      : value;
  }, [value]);
  const ctx = useMemo(() => {
    return merge(context_value, resolvedValue);
  }, [context_value, resolvedValue]);
  return <RenderParamsProvider ctx={ctx}>{children}</RenderParamsProvider>;
};

export function getEachChildren({ value, children, context_value }: EachProps) {
  return value?.map((item, i) => {
    return (
      <Item key={i} value={item} context_value={context_value}>
        {children}
      </Item>
    );
  });
}

export const Each = sveltify<EachProps>(
  ({ value, context_value, children }) => {
    return getEachChildren({ value, children, context_value });
  }
);

export default Each;
