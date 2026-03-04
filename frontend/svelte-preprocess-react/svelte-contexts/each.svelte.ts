import {
  createContext,
  wrapContextValue,
  type WrappedContextValue,
} from './utils.svelte';

const [getSubIndexContext, setSubIndexContext] = createContext<
  WrappedContextValue<number | undefined>
>('$$context/sub-index');

// for ms.Each
export function getSubIndex() {
  return getSubIndexContext();
}

export function setSubIndex(getIndex: () => number | undefined) {
  return setSubIndexContext(wrapContextValue(getIndex));
}
