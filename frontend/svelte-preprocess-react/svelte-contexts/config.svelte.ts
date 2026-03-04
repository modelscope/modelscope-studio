import {
  createContext,
  wrapContextValue,
  type WrappedContextValue,
} from './utils.svelte';

export type ConfigType = 'antd';

const [getConfigTypeContext, setConfigTypeContext] = createContext<
  WrappedContextValue<ConfigType>
>('$$context/config-type');

export function setConfigType(key: () => ConfigType) {
  return setConfigTypeContext(wrapContextValue(key)) as NonNullable<
    ReturnType<typeof setConfigTypeContext>
  >;
}
export function getConfigType() {
  return getConfigTypeContext() || wrapContextValue<ConfigType>(() => 'antd');
}
