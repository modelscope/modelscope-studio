import { initialize } from '@svelte-preprocess-react/component';
import type { createFromIconfontCN } from '@ant-design/icons';
import type { CustomIconOptions } from '@ant-design/icons/es/components/IconFont';
import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';

const iconfontContextKey = '$$ms-gr-antd-iconfont-context-key';

let createFromIconfont: typeof createFromIconfontCN;
async function getCreateFromIconfont() {
  if (createFromIconfont) {
    return createFromIconfont;
  }
  await initialize();
  createFromIconfont = await import('./create-iconfont').then(
    (m) => m.createFromIconfontCN
  );
  return createFromIconfont;
}

export function setIconfontContext() {
  const writableOptions = writable<CustomIconOptions>();
  const writableIconfont = writable<ReturnType<typeof createFromIconfontCN>>();

  writableOptions.subscribe(async (value) => {
    const createFromIconfontCN = await getCreateFromIconfont();
    writableIconfont.set(createFromIconfontCN(value));
  });
  setContext(iconfontContextKey, writableIconfont);
  return writableOptions;
}

export function getIconfontContext() {
  return getContext(iconfontContextKey) as
    | Writable<ReturnType<typeof createFromIconfontCN>>
    | undefined;
}
