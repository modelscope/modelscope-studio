import React, { useEffect, useMemo, useRef } from 'react';

import { useMarkdownContext } from '../context';
import { useCustomProps } from '../hooks/useCustomProps';
import { useMemoizedEqualValue } from '../hooks/useMemoizedEqualValue';

function getElementNodes(html: string, attrs: Record<string, any>) {
  const replaceTemplate = (template: string) => {
    return template.replace(/\{(\w+)\}/g, (str, key) => {
      if (Reflect.has(attrs, key)) {
        return attrs[key];
      }
      return str;
    });
  };
  const tmpEl = document.createElement('div');
  tmpEl.innerHTML = html.trim();

  const convert = (el: HTMLElement) => {
    Array.from(el.childNodes).forEach((child) => {
      if (child instanceof Text) {
        child.textContent = replaceTemplate(child.nodeValue || '') || null;
      } else if (child instanceof HTMLElement) {
        for (const attr of child.attributes) {
          if (attr.name.startsWith('on')) {
            const eventName = attr.name.substring(2);
            const matched = attr.value.match(/\{(\w+)\}/);
            if (matched && attrs[matched[1]]) {
              child.addEventListener(eventName, attrs[matched[1]]);
              child.removeAttribute(attr.name);
            }
          } else {
            child.setAttribute(attr.name, replaceTemplate(attr.value));
          }
        }

        if (el.childNodes.length) {
          convert(child);
        }
      }
    });
  };
  convert(tmpEl);

  return Array.from(tmpEl.childNodes);
}

export interface CustomComponentProps {
  node: {
    children: any[];
    tagName: string;
  };
  [prop: PropertyKey]: any;
}

export const CustomComponent: React.FC<CustomComponentProps> = (nodeProps) => {
  const [{ node, ...props }, tagIndex] = useCustomProps(nodeProps);
  const divRef = useRef<HTMLDivElement>(null);
  const tag = node.tagName;
  const { on_custom, custom_components } = useMarkdownContext();
  const onCustom = (data?: any) => {
    on_custom(tag, tagIndex, data);
  };
  const onCustomRef = useRef(onCustom);
  onCustomRef.current = onCustom;
  const template = custom_components[tag].template || '';
  const js = custom_components[tag].js?.trim() || '';
  const filterProps = useMemoizedEqualValue(
    useMemo(() => {
      const _props = Object.keys(props).reduce(
        (acc, prop) => {
          if (custom_components[tag].props?.includes(prop)) {
            acc[prop] = props[prop];
          }
          return acc;
        },
        {} as Record<PropertyKey, any>
      );
      return {
        ..._props,
        children: node.children,
      };
    }, [custom_components, node.children, props, tag])
  );

  useEffect(() => {
    const el = divRef.current;
    if (!el) {
      return;
    }
    let userProps: Record<PropertyKey, any> = {};
    let onMountFn: (el: HTMLDivElement) => void = () => {};
    const onMount = (callback: (el: HTMLDivElement) => void) => {
      onMountFn = callback;
    };
    if (js) {
      userProps =
        new Function(`return ${js}`)()(
          // props
          filterProps,
          // cc
          {
            dispatch: (value?: any) => onCustomRef.current(value),
          },
          // el options
          {
            el,
            onMount,
          }
        ) || {};
    }
    if (template) {
      const attrs = {
        ...filterProps,
        ...userProps,
      };
      const fragment = document.createDocumentFragment();
      getElementNodes(template, attrs).forEach((child) => {
        fragment.appendChild(child);
      });
      el.appendChild(fragment);
    }
    onMountFn(el);
    return () => {
      el.innerHTML = '';
    };
  }, [filterProps, js, template]);

  return <div ref={divRef} />;
};
