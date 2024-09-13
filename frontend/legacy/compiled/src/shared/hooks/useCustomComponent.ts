import { useEffect, useMemo, useRef } from 'react';
import { isFunction } from 'lodash-es';

import type { CustomComponents } from '../type';

import { useMemoizedEqualValue } from './useMemoizedEqualValue';
import { useRefValue } from './useRefValue';

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

export interface CustomComponentOptions {
  component: CustomComponents[string];
  componentProps: Record<string, any>;
  extraProps?: Record<string, any>;
  target: React.RefObject<HTMLDivElement>;
  theme: string;
  locale: string;
  onCustom: (data?: any) => void;
  onBeforeRender?: () => boolean;
}

export function useCustomComponent(options: CustomComponentOptions) {
  const {
    target,
    theme,
    locale,
    onCustom,
    component,
    componentProps,
    extraProps,
    onBeforeRender = () => true,
  } = options;
  const onCustomRef = useRefValue(onCustom);
  const onBeforeRenderRef = useRefValue(onBeforeRender);
  const onDestroyFnRef = useRef<() => void>();
  const mountRef = useRef(false);
  const template = component.template || '';
  const js = component.js?.trim() || '';
  const filterProps = useMemoizedEqualValue(
    useMemo(() => {
      const _props = Object.keys(componentProps).reduce(
        (acc, prop) => {
          if (component.props?.includes(prop)) {
            acc[prop] = componentProps[prop];
          }
          return acc;
        },
        {} as Record<PropertyKey, any>
      );
      return {
        ..._props,
        ...extraProps,
      };
    }, [component.props, componentProps, extraProps])
  );

  useEffect(() => {
    const el = target.current;
    if (!el) {
      return;
    }
    if (!onBeforeRenderRef.current()) {
      return;
    }
    let userProps: Record<PropertyKey, any> = {};
    let onMountFn: (el: HTMLDivElement) => void | (() => void) = () => {};
    let onUpdateFn = () => {};
    let updateCallAfterMount = false;
    const onMount = (callback: (el: HTMLDivElement) => void | (() => void)) => {
      onMountFn = callback;
    };
    const onUpdate = (
      callback: () => void,
      onUpdateOptions: { callAfterMount?: boolean }
    ) => {
      onUpdateFn = callback;
      updateCallAfterMount = onUpdateOptions?.callAfterMount || false;
    };

    if (js) {
      let formattedStr = js.trim();
      if (formattedStr.startsWith(';')) {
        formattedStr = formattedStr.slice(1);
      }
      if (formattedStr.endsWith(';')) {
        formattedStr = formattedStr.slice(0, -1);
      }
      userProps =
        new Function(`return ${formattedStr}`)()(
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
            onUpdate,
            theme,
            locale,
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
    if (!mountRef.current) {
      onDestroyFnRef.current = onMountFn(el) || (() => {});
      mountRef.current = true;
      if (updateCallAfterMount) {
        onUpdateFn();
      }
    } else {
      onUpdateFn();
    }
  }, [
    filterProps,
    js,
    locale,
    onBeforeRenderRef,
    onCustomRef,
    target,
    template,
    theme,
  ]);
  useEffect(() => {
    return () => {
      if (isFunction(onDestroyFnRef.current)) {
        onDestroyFnRef.current();
      }
      if (target.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        target.current.innerHTML = '';
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
