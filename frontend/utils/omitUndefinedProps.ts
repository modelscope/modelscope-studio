export function omitUndefinedProps<T extends Record<PropertyKey, any>>(
  props: T
): T {
  return Object.keys(props).reduce((acc, key) => {
    if (props[key] !== undefined) {
      acc[key as keyof T] = props[key];
    }
    return acc;
  }, {} as T);
}
