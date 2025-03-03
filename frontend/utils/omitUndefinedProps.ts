export function omitUndefinedProps<T extends Record<PropertyKey, any>>(
  props: T,
  options?: {
    omitNull?: boolean;
  }
): T {
  return Object.keys(props).reduce((acc, key) => {
    if (
      props[key] !== undefined &&
      (options?.omitNull ? props[key] !== null : true)
    ) {
      acc[key as keyof T] = props[key];
    }
    return acc;
  }, {} as T);
}
