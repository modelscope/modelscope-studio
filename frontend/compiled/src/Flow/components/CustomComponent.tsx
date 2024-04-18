import React, { useMemo, useRef } from 'react';

import { CustomComponents, useCustomComponent } from '../../shared';
import { useFlow } from '../FlowContext';

export interface CustomComponentProps {
  value?: any;
  onChange?: (value: any) => void;
  attr: string;
  node: string;
  component: CustomComponents[string];
  index?: number;
  id: string;
}

export const CustomComponent: React.FC<CustomComponentProps> = ({
  value,
  onChange,
  component,
  attr,
  node,
  index,
  id,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { theme, on_custom, locale } = useFlow();

  const onCustom = (data?: any) => {
    onChange?.(data);
    on_custom({ id, node, attr, index, value: data });
  };

  useCustomComponent({
    target: divRef,
    theme,
    onCustom,
    component,
    locale,
    componentProps: props,
    extraProps: useMemo(() => {
      return index !== undefined
        ? {
            value,
            attr,
            node,
            index,
          }
        : {
            value,
            attr,
            node,
          };
    }, [attr, index, node, value]),
  });
  return <div ref={divRef} />;
};
