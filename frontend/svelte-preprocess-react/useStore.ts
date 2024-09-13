import { useEffect, useMemo, useState } from 'react';
import { derived, get, type Readable } from 'svelte/store';

/**
 * Hook for using Svelte stores in React.
 *
 * Usage:
 *
 * const User: React.FC = () => {
 *   const $user = useStore(userStore);
 *   return <h1>Hello, {$user.name}</h1>;
 * }
 */
export function useStore<T>(store: Readable<T>): T {
  const [value, setValue] = useState(() => get(store));
  useEffect(() => {
    let first = true;
    const cancel = store.subscribe((next) => {
      if (first) {
        first = false;
        if (next === value) {
          return;
        }
      }
      setValue(next);
    });
    return cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);
  return value;
}

export function useStores<T>(stores: Readable<T>[]): T[] {
  const store = useMemo(() => derived(stores, ($stores) => $stores), [stores]);
  return useStore(store);
}
export default useStore;
