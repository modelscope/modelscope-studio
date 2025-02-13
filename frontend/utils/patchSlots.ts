import { isFunction } from 'lodash-es';

export function patchSlots<
  T extends (
    patch: <S extends React.ReactNode | ((...args: any[]) => React.ReactNode)>(
      slot?: S,
      functionProp?: boolean
    ) => S
  ) => Record<PropertyKey, any>,
>(params: any[], transform: T): ReturnType<T> {
  const patchSlotRender = ((slot, functionProp) => {
    if (isFunction(slot)) {
      if (functionProp) {
        return (...args: any[]) => {
          return slot(...args, ...params);
        };
      }
      return slot(...params);
    }
    return slot;
  }) as Parameters<typeof transform>[0];
  return transform(patchSlotRender) as ReturnType<T>;
}
