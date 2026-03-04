import { getContext, setContext } from 'svelte';

export function wrapContextValue<T>(observableValue: () => T) {
  let value = $state(observableValue());
  type UpdateProxyValue =
    T extends Record<PropertyKey, any>
      ? T extends (...args: any[]) => any
        ? never
        : T
      : never;
  function update(fn: (proxy: UpdateProxyValue) => UpdateProxyValue | void) {
    const result = fn(value as UpdateProxyValue);
    if (typeof result !== 'undefined') {
      value = result;
    }
  }
  $effect(() => {
    value = observableValue();
  });
  return {
    get value() {
      return value;
    },
    set(newValue: T) {
      value = newValue;
    },
    // like immer update
    update,
  } as const;
}

export type WrappedContextValue<T> = ReturnType<typeof wrapContextValue<T>>;

export function createContext<T>(
  key: string
): [() => T | undefined, (context: T) => T] {
  return [
    () => {
      return getContext(key);
    },
    (context) => setContext(key, context),
  ];
}
