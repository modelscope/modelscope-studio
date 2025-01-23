import { sveltify } from '@svelte-preprocess-react';
import { ContextPropsProvider } from '@svelte-preprocess-react/context';

export interface EachItemProps {
  __internal_value: any;
  children?: React.ReactNode;
}

export const EachItem = sveltify<EachItemProps>(
  ({ __internal_value, children }) => {
    return (
      <ContextPropsProvider ctx={__internal_value}>
        {children}
      </ContextPropsProvider>
    );
  }
);

export default EachItem;
