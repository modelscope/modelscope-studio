import {
  createContext,
  wrapContextValue,
  type WrappedContextValue,
} from './utils.svelte';

const [getSlotsContext, setSlotsContext] =
  createContext<WrappedContextValue<Record<string, HTMLElement>>>(
    '$$context/slots'
  );

const [getSlotParamsMappingContext, setSlotParamsMappingContext] =
  createContext<WrappedContextValue<((...args: any[]) => any) | undefined>>(
    '$$context/slot-params-mapping'
  );

const [getSlotKeyContext, setSlotKeyContext] = createContext<
  WrappedContextValue<string | undefined> | undefined
>('$$context/slot-key');

const [getComponentSlotValueContext, setComponentSlotValueContext] =
  createContext<
    WrappedContextValue<{
      slotKey: string | undefined;
      slotIndex: number | undefined;
      subSlotIndex: number | undefined;
    }>
  >('$$context/component-slot-value');

// slots
export function getSlots() {
  return setSlotsContext(wrapContextValue(() => ({}))) as NonNullable<
    ReturnType<typeof setSlotsContext>
  >;
}

export function getSetSlot() {
  const slots = getSlotsContext();
  return (prevSlot: string, slot: string, el: HTMLElement) => {
    if (!slots) {
      return;
    }

    if (prevSlot) {
      slots.update((proxy) => {
        Reflect.deleteProperty(proxy, prevSlot);
      });
    }
    slots.update((proxy) => {
      proxy[slot] = el;
    });
  };
}

// params mapping function
export function setSlotParamsMapping(
  getParamsMapping: () => ((...args: any[]) => any) | undefined
) {
  return setSlotParamsMappingContext(
    wrapContextValue(getParamsMapping)
  ) as NonNullable<ReturnType<typeof setSlotParamsMappingContext>>;
}

export function getSlotParamsMapping() {
  return getSlotParamsMappingContext();
}

// slot key
export function resetSlotKey() {
  setSlotKeyContext(undefined);
}
export function setSlotKey(getSlot: () => string) {
  return setSlotKeyContext(wrapContextValue(getSlot)) as NonNullable<
    ReturnType<typeof setSlotKeyContext>
  >;
}
export function getSlotKey() {
  return getSlotKeyContext();
}

// component slot value
export function setComponentSlotValue(
  getValue: () => {
    slot: string | undefined;
    index: number | undefined;
    subIndex: number | undefined;
  }
) {
  return setComponentSlotValueContext(
    wrapContextValue(() => {
      const { slot, index, subIndex } = getValue();
      return {
        slotKey: slot,
        slotIndex: index,
        subSlotIndex: subIndex,
      };
    })
  );
}
export function getComponentSlotValue() {
  return getComponentSlotValueContext();
}
