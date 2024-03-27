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
}

export const CustomComponent: React.FC<CustomComponentProps> = ({
  value,
  onChange,
  component,
  attr,
  node,
  index,
  ...props
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const { theme, on_custom } = useFlow();

  const onCustom = (data?: any) => {
    onChange?.(data);
    on_custom({ value: data, attr, index, node });
  };

  useCustomComponent({
    target: divRef,
    theme,
    onCustom,
    component,
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
