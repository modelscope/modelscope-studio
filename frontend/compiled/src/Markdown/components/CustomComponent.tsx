import React, { useMemo, useRef } from 'react';

import { useCustomComponent } from '../../shared';
import { useMarkdownContext } from '../context';
import { useCustomProps } from '../hooks/useCustomProps';

export interface CustomComponentProps {
  node: {
    children: any[];
    tagName: string;
  };
  [prop: PropertyKey]: any;
}

export const CustomComponent: React.FC<CustomComponentProps> = (nodeProps) => {
  const [{ node, ...props }, { tagIndex, tagEnd }] = useCustomProps(nodeProps);
  const divRef = useRef<HTMLDivElement>(null);
  const tag = node.tagName;
  const { on_custom, custom_components, theme } = useMarkdownContext();

  const onCustom = (data?: any) => {
    on_custom(tag, tagIndex, data);
  };

  const extraProps = useMemo(() => {
    return {
      children: node.children,
    };
  }, [node.children]);

  useCustomComponent({
    target: divRef,
    component: custom_components[tag],
    componentProps: props,
    extraProps,
    onCustom,
    theme,
    onBeforeRender: () => tagEnd,
  });

  return <div ref={divRef} />;
};
