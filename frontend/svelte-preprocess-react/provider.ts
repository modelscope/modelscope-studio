import type { LoadingStatus } from '@gradio/statustracker';
import { getContext, setContext } from 'svelte';
import { get, type Writable, writable } from 'svelte/store';

const configTypeKey = '$$ms-gr-config-type-key';

export type ConfigType = 'antd';

export function setConfigType(key: ConfigType) {
  setContext(configTypeKey, key);
}
export function getConfigType(): ConfigType {
  return getContext(configTypeKey) || 'antd';
}

const loadingStatusKey = '$$ms-gr-loading-status-key';

export interface SetLoadingStatusOptions {
  generating: boolean;
  error: boolean;
}

export function getLoadingStatus(options: SetLoadingStatusOptions) {
  const loadingStatus = writable<LoadingStatus | null>(null);
  const loadingStatusMap = writable({
    map: new Map<number, LoadingStatus | null>(),
  });
  const setLoadingStatusOptions = writable(options);
  setContext(loadingStatusKey, {
    loadingStatusMap,
    options: setLoadingStatusOptions,
  });

  loadingStatusMap.subscribe(({ map }) => {
    loadingStatus.set(map.values().next().value || null);
  });

  return [
    loadingStatus,
    (value: SetLoadingStatusOptions) => {
      setLoadingStatusOptions.set(value);
    },
  ] as const;
}

export function getSetLoadingStatusFn() {
  const loadingKey = window.ms_globals.loadingKey++;
  const ctx = getContext(loadingStatusKey) as
    | {
        options: Writable<SetLoadingStatusOptions>;
        loadingStatusMap: Writable<{
          map: Map<number, LoadingStatus | null>;
        }>;
      }
    | undefined;

  return (loadingStatus: LoadingStatus | null) => {
    if (!ctx || !loadingStatus) {
      return;
    }
    const { loadingStatusMap, options } = ctx;
    const { generating, error } = get(options);
    if (
      loadingStatus?.status === 'pending' ||
      (error && loadingStatus?.status === 'error') ||
      (generating && (loadingStatus?.status as string)) === 'generating'
    ) {
      loadingStatusMap.update(({ map }) => {
        map.set(loadingKey, loadingStatus);
        return {
          map,
        };
      });
    } else {
      loadingStatusMap.update(({ map }) => {
        map.delete(loadingKey);
        return {
          map,
        };
      });
    }
  };
}
