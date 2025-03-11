import { isObject } from 'lodash-es';

export function convertToCamelCase(str: string) {
  return str.replace(/(^|_)(\w)/g, (_match, _separator, char, index) => {
    if (index === 0) {
      return char.toLowerCase();
    } else {
      return char.toUpperCase();
    }
  });
}

export const convertObjectKeyToCamelCase = <T>(obj: T): T => {
  if (!isObject(obj)) {
    return obj;
  }
  return Object.keys(obj).reduce((acc, key) => {
    acc[convertToCamelCase(key) as keyof T] = obj[key];
    return acc;
  }, {} as T);
};
