import { sveltify } from '@svelte-preprocess-react';
import {
  ContextPropsProvider,
  useContextPropsContext,
} from '@svelte-preprocess-react/context';
import { useEffect, useState } from 'react';
import { useFunction } from '@utils/hooks/useFunction';

export interface FilterProps {
  children?: React.ReactNode;
  paramsMapping?: string;
  asItem?: string;
}

export const Filter = sveltify<FilterProps>(
  ({ children, paramsMapping, asItem }) => {
    const paramsMappingFn = useFunction(paramsMapping);
    const [filteredContext, setFilteredContext] = useState<any>(undefined);
    const { forceClone, ctx } = useContextPropsContext();
    useEffect(() => {
      if (paramsMappingFn) {
        setFilteredContext(paramsMappingFn(ctx));
      } else if (asItem) {
        setFilteredContext(ctx?.[asItem]);
      }
      // else undefined
    }, [asItem, ctx, paramsMappingFn]);
    return (
      <ContextPropsProvider
        forceClone={forceClone}
        ctx={filteredContext}
        mergeContext={false}
      >
        {children}
      </ContextPropsProvider>
    );
  }
);

export default Filter;
