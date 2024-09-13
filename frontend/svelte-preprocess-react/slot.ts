import { getContext, setContext } from 'svelte';
import { get, type Writable, writable } from 'svelte/store';

const slotsKey = '$$ms-gr-antd-slots-key';

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

const slotParamsKey = '$$ms-gr-antd-render-slot-context-key';

export function getSetSlotParamsFn() {
  const slotParams = setContext(
    slotParamsKey,
    writable<Record<string, any[]>>({})
  );
  return (key: string, params: any[] | ((prevValue: any[]) => any[])) => {
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
  return getContext(slotParamsKey) as
    | Writable<Record<string, any[]>>
    | undefined;
}

const slotContextKey = '$$ms-gr-antd-context-key';
export function getSetSlotContextFn() {
  const value = writable();
  setContext(slotContextKey, value);
  return (v: any) => {
    value.set(v);
  };
}

/**
 *
 * will run `resetSlotKey` inside
 */
export function getSlotContext<
  T extends {
    as_item?: string;
    _internal: Record<string, any>;
  },
>(props: T): [Writable<T>, (props: T) => void] {
  if (!Reflect.has(props, 'as_item') || !Reflect.has(props, '_internal')) {
    throw new Error('`as_item` and `_internal` is required');
  }
  const slotKey = getSlotKey();
  const componentSlotContext = setComponentSlotContext({
    slot: undefined,
    index: props._internal.index,
    subIndex: props._internal.subIndex,
  });
  if (slotKey) {
    slotKey.subscribe((v) => {
      componentSlotContext.slotKey.set(v as string);
    });
  }
  // reset slot key to make sure the sub component does not be affected by gr.Slot()
  resetSlotKey();
  const ctx = getContext(slotContextKey) as Writable<T>;
  const as_item = get(ctx)?.as_item || props.as_item;
  const initialCtxValue = ctx
    ? as_item
      ? get(ctx)[as_item as keyof T]
      : get(ctx)
    : {};
  const mergedProps = writable({
    ...props,
    ...initialCtxValue,
  });
  if (!ctx) {
    return [
      mergedProps,
      (v) => {
        mergedProps.set(v);
      },
    ];
  }
  ctx.subscribe((ctxValue) => {
    const { as_item: merged_as_item } = get(mergedProps);
    if (merged_as_item) {
      ctxValue = (ctxValue as Record<string, any>)[merged_as_item];
    }
    mergedProps.update((prev) => ({
      ...prev,
      ...ctxValue,
    }));
  });

  return [
    mergedProps,
    (v) => {
      const ctxValue = v.as_item ? get(ctx)[v.as_item as keyof T] : get(ctx);
      return mergedProps.set({
        ...v,
        ...ctxValue,
      });
    },
  ];
}

const slotKey = '$$ms-gr-antd-slot-key';

export function resetSlotKey() {
  setContext(slotKey, writable(undefined));
}
export function setSlotKey(slot: string) {
  return setContext(slotKey, writable(slot));
}
export function getSlotKey() {
  return getContext(slotKey) as Writable<string | undefined> | undefined;
}

const componentSlotContextKey = '$$ms-gr-antd-component-slot-context-key';

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
