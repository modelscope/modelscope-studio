import { isObject } from 'lodash-es';

export function getURLFileExtension(url: string) {
  let extension = url.split('.').pop();
  extension = extension?.split('?').shift();
  if (extension && extension.includes('/')) {
    const components = extension.split('/');
    extension = components[0];
  }
  return extension;
}

export function isMobile() {
  return window.innerWidth <= 480;
}

export function safeParseJSON<T>(str: string, defaultValue: T): T {
  try {
    if (!str) {
      return defaultValue;
    }
    return JSON.parse(str) as T;
  } catch (e) {
    return defaultValue;
  }
}

/**
 *
 * @param nodeProps This method must be called if the custom component receives a property named `type`.
 * @returns
 */
export function getCustomProps<T extends { node?: any }>(nodeProps: T): T {
  const node = nodeProps.node;
  const firstChild = node?.children?.[0];
  if (isObject(firstChild) && !(firstChild as any).position) {
    return {
      ...nodeProps,
      ...firstChild,
      node: {
        ...node,
        children: node.children.slice(1),
      },
    } as T;
  }

  return nodeProps as T;
}
