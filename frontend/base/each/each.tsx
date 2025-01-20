import { sveltify } from '@svelte-preprocess-react';
import { ContextPropsProvider } from '@svelte-preprocess-react/context';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React, { useMemo } from 'react';
import { useTargets } from '@utils/hooks/useTargets';
import { merge } from 'lodash-es';

export interface EachProps {
  value?: any[];
  contextValue?: Record<PropertyKey, any>;
  children?: React.ReactNode;
}

const Item: React.FC<{
  value?: any;
  contextValue?: Record<PropertyKey, any>;
  children?: React.ReactNode;
}> = ({ value, children, contextValue }) => {
  const resolvedValue = useMemo(() => {
    return typeof value !== 'object' || Array.isArray(value)
      ? { value }
      : value;
  }, [value]);
  const ctx = useMemo(() => {
    return merge({}, contextValue, resolvedValue);
  }, [contextValue, resolvedValue]);
  return (
    <ContextPropsProvider forceClone ctx={ctx}>
      {children}
    </ContextPropsProvider>
  );
};

export const Each = sveltify<EachProps, ['children']>(
  ({ value, contextValue, children }) => {
    const targets = useTargets(children);
    return (
      <>
        <div style={{ display: 'none' }}>
          {/* Isolate the outer Context of Each */}
          <ContextPropsProvider>{children}</ContextPropsProvider>
        </div>
        {value?.map((item, i) => {
          return (
            <Item value={item} contextValue={contextValue} key={i}>
              {targets.map((target, j) => {
                return <ReactSlot clone slot={target} key={j} />;
              })}
            </Item>
          );
        })}
      </>
    );
  }
);

export default Each;
