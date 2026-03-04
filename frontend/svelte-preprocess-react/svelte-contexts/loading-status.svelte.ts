import { SvelteMap } from 'svelte/reactivity';
import type { ILoadingStatus } from '@gradio/statustracker';

import {
  createContext,
  wrapContextValue,
  type WrappedContextValue,
} from './utils.svelte';

export type ConfigType = 'antd';

const [getLoadingStatusContext, setLoadingStatusContext] = createContext<
  | {
      loadingStatusMap: WrappedContextValue<
        SvelteMap<number, ILoadingStatus | null>
      >;
      options: WrappedContextValue<SetLoadingStatusOptions>;
    }
  | undefined
>('$$context/loading-status');

export interface SetLoadingStatusOptions {
  generating: boolean;
  error: boolean;
}

export function getLoadingStatus(getOptions: () => SetLoadingStatusOptions) {
  const setLoadingStatusOptions =
    wrapContextValue<SetLoadingStatusOptions>(getOptions);

  const loadingStatusMap = wrapContextValue(
    () => new SvelteMap<number, ILoadingStatus | null>()
  );
  const loadingStatus = wrapContextValue<ILoadingStatus | null>(() => {
    const map = loadingStatusMap.value;
    return map.values().next().value || null;
  });

  setLoadingStatusContext({
    loadingStatusMap,
    options: setLoadingStatusOptions,
  });

  return loadingStatus;
}

export function setLoadingStatus(getValue: () => ILoadingStatus | null) {
  const loadingKey = window.ms_globals.loadingKey++;
  const ctx = getLoadingStatusContext();

  const updateLoadingStatusMap = (loadingStatus: ILoadingStatus | null) => {
    if (!ctx || !loadingStatus) {
      return;
    }
    const { loadingStatusMap, options } = ctx;
    const { generating, error } = options.value;

    if (
      loadingStatus?.status === 'pending' ||
      (error && loadingStatus?.status === 'error') ||
      (generating && (loadingStatus?.status as string)) === 'generating'
    ) {
      loadingStatusMap.update((proxy) => {
        proxy.set(loadingKey, loadingStatus);
      });
    } else {
      loadingStatusMap.update((proxy) => {
        proxy.delete(loadingKey);
      });
    }
  };
  $effect(() => {
    updateLoadingStatusMap(getValue());
  });
}
