import { sveltify } from '@svelte-preprocess-react';
import { useContextPropsContext } from '@svelte-preprocess-react/context';
import { useEffect, useRef } from 'react';

export interface EachPlaceHolderProps {
  value?: any[];
  contextValue?: Record<PropertyKey, any>;
  onChange?: (
    props: EachPlaceHolderProps & {
      forceClone: boolean;
    }
  ) => void;
}

export const EachPlaceholder = sveltify<EachPlaceHolderProps>(
  ({ value, contextValue, onChange }) => {
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const { forceClone } = useContextPropsContext();
    useEffect(() => {
      onChangeRef.current?.({ value, contextValue, forceClone });
    }, [value, contextValue, forceClone]);
    return <span style={{ display: 'none' }} />;
  },
  {
    ignore: true,
  }
);

export default EachPlaceholder;
