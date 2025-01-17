import { isUndefined } from 'lodash-es';
import { getContext, setContext } from 'svelte';
import { get, type Writable, writable } from 'svelte/store';

import { mapProps } from './component';
import { getSetLoadingStatusFn } from './provider';

const slotsKey = '$$ms-gr-slots-key';

export function getSlots() {
  const slots = writable({} as Record<string, HTMLElement>);

  return setContext(slotsKey, slots);
}

export function getSetSlotFn() {
  const slots =
    (getContext(slotsKey) as Writable<Record<string, HTMLElement>>) ||
    writable({});

  return (prevSlot: string, slot: string, el: HTMLElement) => {
    slots.update((v) => {
      const newValue = { ...v };
      if (prevSlot) {
        Reflect.deleteProperty(newValue, prevSlot);
      }
      return { ...newValue, [slot]: el };
    });
  };
}

const slotParamsMappingFnKey = '$$ms-gr-slot-params-mapping-fn-key';

export function getSlotParamsMappingFn() {
  const slotParamsMappingFn = getContext(slotParamsMappingFnKey) as
    | Writable<((...args: any[]) => any) | undefined>
    | undefined;
  return slotParamsMappingFn;
}

export function getSetSlotParamsMappingFnFn(fn?: (...args: any[]) => any) {
  return setContext(
    slotParamsMappingFnKey,
    writable<((...args: any[]) => any) | undefined>(fn)
  );
}

const slotParamsKey = '$$ms-gr-slot-params-key';

export type SetSlotParams = (
  key: string,
  params: any[] | ((prevValue: any[]) => any[])
) => void;

/**
 *
 * @deprecated
 */
export function getSetSlotParamsFn(): SetSlotParams {
  const slotParams = setContext(
    slotParamsKey,
    writable<Record<string, any[]>>({})
  );
  return (key, params) => {
    slotParams.update((v) => {
      if (typeof params === 'function') {
        return {
          ...v,
          [key]: params(v[key]),
        };
      }
      return {
        ...v,
        [key]: params,
      };
    });
  };
}

export function getSlotParams() {
  const slotParams = getContext(slotParamsKey) as
    | Writable<Record<string, any[]>>
    | undefined;
  setContext(slotParamsKey, undefined);
  return slotParams;
}

const slotContextKey = '$$ms-gr-slot-context-key';
export function getSetSlotContextFn({ inherit }: { inherit?: boolean } = {}) {
  const value = writable();
  let unsubscribe: (() => void) | undefined;
  if (inherit) {
    const ctxValue = getContext(slotContextKey) as Writable<any>;
    unsubscribe = ctxValue?.subscribe((v) => {
      value?.set(v);
    });
  }
  let hasSetValue = !inherit;
  setContext(slotContextKey, value);
  return (v: any) => {
    if (!hasSetValue) {
      hasSetValue = true;
      unsubscribe?.();
    }
    value.set(v);
  };
}

export function ensureObjectCtxValue(ctxValue: any) {
  if (isUndefined(ctxValue)) {
    return {};
  }

  return typeof ctxValue === 'object' && !Array.isArray(ctxValue)
    ? ctxValue
    : { value: ctxValue };
}

// for ms.Each
const subIndexKey = '$$ms-gr-sub-index-context-key';
function getSubIndexContext() {
  return (getContext(subIndexKey) as number) || null;
}

function setSubIndexContext(index?: number) {
  return setContext(subIndexKey, index);
}

export function getSlotContext<
  T extends {
    as_item?: string;
    _internal: Record<string, any>;
    restProps?: Record<string, any>;
    props?: Record<string, any>;
  },
>(
  props: T,
  restPropsMapping?: Record<keyof T['restProps'], string>,
  options?: {
    shouldSetLoadingStatus?: boolean;
    shouldRestSlotKey?: boolean;
  }
): [
  Writable<
    T & {
      originalRestProps?: Record<string, any>;
    }
  >,
  (props: T) => void,
] {
  const shouldRestSlotKey = options?.shouldRestSlotKey ?? true;
  const shouldSetLoadingStatus = options?.shouldSetLoadingStatus ?? true;
  if (!Reflect.has(props, 'as_item') || !Reflect.has(props, '_internal')) {
    throw new Error('`as_item` and `_internal` is required');
  }
  const slotKey = getSlotKey();
  // get slotParamsMappingFn for slot
  const slotParamsMappingFn = getSlotParamsMappingFn();
  // cleanup
  const setSlotParamsMappingFn = getSetSlotParamsMappingFnFn();
  setSlotParamsMappingFn.set(undefined);
  const componentSlotContext = setComponentSlotContext({
    slot: undefined,
    index: props._internal.index,
    subIndex: props._internal.subIndex,
  });
  // for ms.Each
  const subIndex = getSubIndexContext();
  if (typeof subIndex === 'number') {
    setSubIndexContext(undefined);
  }
  // for loading_status
  const setLoadingStatus = shouldSetLoadingStatus
    ? getSetLoadingStatusFn()
    : () => {};

  if (typeof props._internal.subIndex === 'number') {
    setSubIndexContext(props._internal.subIndex);
  }

  if (slotKey) {
    slotKey.subscribe((v) => {
      componentSlotContext.slotKey.set(v as string);
    });
  }
  // reset slot key to make sure the sub component does not be affected by gr.Slot()
  if (shouldRestSlotKey) {
    resetSlotKey();
  }

  const as_item = props.as_item;
  const mergeRestProps = (
    restProps?: Record<string, any>,
    __render_as_item?: string
  ) => {
    return restProps
      ? {
          ...mapProps(
            {
              ...restProps,
            },
            restPropsMapping
          ),
          __render_slotParamsMappingFn: slotParamsMappingFn
            ? get(slotParamsMappingFn)
            : undefined,
          __render_as_item,
          __render_restPropsMapping: restPropsMapping,
        }
      : undefined;
  };

  const mergedProps = writable<T>({
    ...props,
    _internal: {
      ...props._internal,
      index: subIndex ?? props._internal.index,
    },
    restProps: mergeRestProps(props.restProps, as_item),
    originalRestProps: props.restProps,
  });

  // for paramsMapping of Slot
  if (slotParamsMappingFn) {
    slotParamsMappingFn.subscribe((v) => {
      mergedProps.update((prev) => ({
        ...prev,
        restProps: {
          ...prev.restProps,
          __slotParamsMappingFn: v,
        },
      }));
    });
  }

  return [
    mergedProps,
    (v) => {
      setLoadingStatus(v.restProps?.loading_status);
      mergedProps.set({
        ...v,
        _internal: {
          ...v._internal,
          index: subIndex ?? v._internal.index,
        },
        restProps: mergeRestProps(v.restProps, v.as_item),
        originalRestProps: v.restProps,
      });
    },
  ];
}

const slotKey = '$$ms-gr-slot-key';

export function resetSlotKey() {
  setContext(slotKey, writable(undefined));
}
export function setSlotKey(slot: string) {
  return setContext(slotKey, writable(slot));
}
export function getSlotKey() {
  return getContext(slotKey) as Writable<string | undefined> | undefined;
}

const componentSlotContextKey = '$$ms-gr-component-slot-context-key';

export function setComponentSlotContext({
  slot,
  index,
  subIndex,
}: {
  slot: string | undefined;
  index: number | undefined;
  subIndex: number | undefined;
}) {
  return setContext(componentSlotContextKey, {
    slotKey: writable(slot),
    slotIndex: writable(index),
    subSlotIndex: writable(subIndex),
  });
}
export function getComponentSlotContext() {
  return getContext(componentSlotContextKey) as
    | {
        slotKey: Writable<string | undefined>;
        slotIndex: Writable<number | undefined>;
        subSlotIndex: Writable<number | undefined>;
      }
    | undefined;
}
