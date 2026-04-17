import {
  getSubIndex,
  setSubIndex,
} from '@svelte-preprocess-react/svelte-contexts/each.svelte';
import { setLoadingStatus } from '@svelte-preprocess-react/svelte-contexts/loading-status.svelte';
import {
  getSlotKey,
  getSlotParamsMapping,
  resetSlotKey,
  setComponentSlotValue,
} from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
import type React from 'react';
import { SvelteSet } from 'svelte/reactivity';
import { Gradio, type SharedProps } from '@gradio/utils';
import { convertToCamelCase } from '@utils/convertToCamelCase';
import { omitUndefinedProps } from '@utils/omitUndefinedProps';
import { isPlainObject, mapKeys, omit } from 'lodash-es';
import { type Snippet, untrack } from 'svelte';

const gradioTranslatableProps = [
  'label',
  'info',
  'placeholder',
  'description',
  'title',
  'value',
];

const skippedGradioProps = [
  'interactive',
  'gradio',
  'server',
  'target',
  'theme_mode',
  'root',
  'name',
  // 'visible',
  // 'elem_id',
  // 'elem_classes',
  // 'elem_style',
  '_internal',
  'props',
  // 'value',
  '_selectable',
  'loading_status',
  'value_is_output',
];
export const gradioProps = skippedGradioProps.concat(['attached_events']);

export function mapComponentProps<T extends Record<string, any>>(
  props: T,
  mapping: Record<keyof T, string | undefined> = {} as Record<
    keyof T,
    string | undefined
  >,
  skipGradioProps = false
) {
  return mapKeys(
    omit(props, skipGradioProps ? [] : skippedGradioProps),
    (_, key) => {
      return mapping[key] || convertToCamelCase(key);
    }
  );
}

export function processEvents<
  T extends {
    gradio?: Gradio<Record<PropertyKey, any>>;
    _internal: Record<string, any>;
    additionalProps?: Record<string, any>;
    restProps?: Record<string, any>;
  },
>(props: T, eventPropsMapping?: Record<string, string | undefined>) {
  const {
    gradio,
    _internal: internal,
    restProps,
    ...component
  } = props as T & {
    gradio?: Gradio<Record<PropertyKey, any>>;
  };
  if (!gradio) {
    return {};
  }
  // gradio props
  const attachedEvents: string[] = restProps?.attached_events || [];

  return {
    ...Array.from(
      new SvelteSet<string>([
        ...(Object.keys(internal)
          .map((key) => {
            const matched = key.match(/bind_(.+)_event/);
            if (matched && matched[1]) {
              return matched[1];
            }
            return null;
          })
          .filter(Boolean) as string[]),
        ...attachedEvents.map((event) => {
          if (eventPropsMapping && eventPropsMapping[event]) {
            return eventPropsMapping[event];
          }
          return event;
        }),
      ])
    ).reduce(
      (acc, event) => {
        const splitted = event.split('_');
        const handler = (...args: any[]) => {
          const payload = args.map((arg) => {
            if (
              args &&
              typeof arg === 'object' &&
              (arg.nativeEvent || arg instanceof Event)
            ) {
              return {
                type: arg.type,
                detail: arg.detail,
                timestamp: arg.timeStamp,
                clientX: arg.clientX,
                clientY: arg.clientY,
                targetId: arg.target.id,
                targetClassName: arg.target.className,
                altKey: arg.altKey,
                ctrlKey: arg.ctrlKey,
                shiftKey: arg.shiftKey,
                metaKey: arg.metaKey,
              };
            }
            return arg;
          });
          let serializedPayload: any;
          try {
            serializedPayload = JSON.parse(JSON.stringify(payload));
          } catch {
            function serialize(obj: any) {
              try {
                JSON.stringify(obj);
                return obj;
              } catch {
                // first level
                if (isPlainObject(obj)) {
                  return Object.fromEntries(
                    Object.entries(obj)
                      .map(([k, v]) => {
                        try {
                          JSON.stringify(v);
                          return [k, v];
                        } catch {
                          // second level
                          if (isPlainObject(v)) {
                            return [
                              k,
                              Object.fromEntries(
                                Object.entries(v as object).filter(
                                  ([_, nv]) => {
                                    try {
                                      JSON.stringify(nv);
                                      return true;
                                    } catch {
                                      return false;
                                    }
                                  }
                                )
                              ),
                            ];
                          }
                          return null;
                        }
                      })
                      .filter(Boolean) as [k: string, v: any][]
                  );
                }
                return {};
              }
            }
            serializedPayload = payload.map((item) => {
              return serialize(item);
            });
          }

          return gradio.dispatch(
            event.replace(/[A-Z]/g, (letter) => '_' + letter.toLowerCase()),
            {
              payload: serializedPayload,
              component: {
                ...component,
                ...omit(restProps, gradioProps),
              },
            }
          );
        };

        if (splitted.length > 1) {
          let value: Record<PropertyKey, any> = {
            ...(component.additionalProps?.[splitted[0]] ||
              restProps?.additional_props?.[splitted[0]] ||
              restProps?.[splitted[0]] ||
              {}),
          };
          acc[splitted[0]] = value;
          for (let i = 1; i < splitted.length - 1; i++) {
            const prop = {
              ...(component.additionalProps?.[splitted[i]] ||
                restProps?.additional_props?.[splitted[0]] ||
                restProps?.[splitted[i]] ||
                {}),
            };
            value[splitted[i]] = prop;
            value = prop;
          }
          const listener = splitted[splitted.length - 1];
          value[`on${listener.slice(0, 1).toUpperCase()}${listener.slice(1)}`] =
            handler;

          return acc;
        }
        const listener = splitted[0];
        acc[`on${listener.slice(0, 1).toUpperCase()}${listener.slice(1)}`] =
          handler;
        return acc;
      },
      {} as Record<string, any>
    ),
  };
}
export function processProps<
  T extends {
    as_item: string | undefined;
    _internal: Record<string, any>;
    additionalProps?: Record<string, any>;
    restProps: Record<string, any>;
    gradio: Gradio<Record<PropertyKey, any>>;
  },
>(
  getPlainProps: () => T,
  restPropsMapping?: Partial<Record<keyof T['restProps'], string>>,
  options?: {
    shouldSetLoadingStatus?: boolean;
    shouldResetSlotKey?: boolean;
  }
) {
  const props = $derived.by(() => getPlainProps());
  const shouldResetSlotKey = options?.shouldResetSlotKey ?? true;
  const shouldSetLoadingStatus = options?.shouldSetLoadingStatus ?? true;

  // throw error once if the property keys are not exist
  const assertProps = () => {
    if (!Reflect.has(props, 'as_item') || !Reflect.has(props, '_internal')) {
      throw new Error('`as_item` and `_internal` is required');
    }
  };
  assertProps();
  const slotKey = getSlotKey();
  // get slotParamsMapping for slot
  const slotParamsMapping = getSlotParamsMapping();

  setComponentSlotValue(() => {
    return {
      slot: slotKey?.value,
      index: props._internal.index,
      subIndex: props._internal.subIndex,
    };
  });

  // reset slot key to make sure the sub component does not be affected by gr.Slot()
  if (shouldResetSlotKey) {
    resetSlotKey();
  }

  // for loading_status
  if (
    shouldSetLoadingStatus &&
    props.additionalProps?.ms_auto_loading !== false
  ) {
    setLoadingStatus(() => props.restProps.loading_status);
  }

  // for ms.Each
  const subIndex = getSubIndex();

  setSubIndex(() => {
    if (typeof subIndex?.value === 'number') {
      return undefined;
    }
    if (typeof props._internal.subIndex === 'number') {
      return props._internal.subIndex;
    }
    return subIndex?.value;
  });

  const proceedEvents = $derived.by(() =>
    processEvents(props, restPropsMapping)
  );

  const processRestProps = (
    restProps?: Record<string, any>,
    events?: Record<string, any>,
    __render_as_item?: string
  ) => {
    const _proceedRestProps = restProps
      ? {
          ...mapComponentProps(
            {
              ...restProps,
            },
            restPropsMapping
          ),
          __render_slotParamsMapping: slotParamsMapping
            ? slotParamsMapping.value
            : undefined,
          __render_as_item,
          __render_restPropsMapping: restPropsMapping,
        }
      : {};
    const _proceedEvents = events
      ? { ...events, __render_eventsRestProps: restProps }
      : {};
    return {
      ..._proceedRestProps,
      ..._proceedEvents,
    };
  };

  const proceedProps = $derived({
    ...props,
    _internal: {
      ...props._internal,
      index: subIndex?.value ?? props._internal.index,
    },
    restProps: processRestProps(props.restProps, proceedEvents, props.as_item),
  });

  return () => proceedProps;
}

export function getProps<
  P extends Record<string, any>,
  E extends Record<string, any> = Record<string, any>,
>(
  getSvelteProps: () => any,
  options?: {
    i18n?: boolean;
  }
) {
  const props: {
    children?: Snippet;
    props: P;
    shared_props: SharedProps;
    gradio?: Gradio<E, P>;
    [x: PropertyKey]: any;
  } = getSvelteProps();
  const enableI18n = options?.i18n ?? true;
  const gradio = props.gradio ? props.gradio : new Gradio<E, P>(props);
  const updateProps = (updatedProps: Partial<P & SharedProps>) => {
    gradio.update(updatedProps);
  };
  const getComponentProps = () => {
    const originalProps = props.props;
    const originalSharedProps = props.shared_props;
    return omitUndefinedProps(
      omit(
        {
          ...gradio.props,
          label: gradio.shared.label,
          ...(enableI18n
            ? {}
            : gradioTranslatableProps.reduce(
                (acc, key) => {
                  if (originalProps[key] !== undefined) {
                    acc[key] = originalProps[key];
                  } else if (originalSharedProps[key] !== undefined) {
                    acc[key] = originalSharedProps[key];
                  }
                  return acc;
                },
                {} as Record<string, any>
              )),
          elem_id: gradio.shared.elem_id as string | undefined,
          elem_classes: gradio.shared.elem_classes as
            | string
            | string[]
            | undefined,
          elem_style: gradio.props.elem_style as React.CSSProperties,
          visible: gradio.shared.visible,
          attached_events: gradio.shared.attached_events,
          loading_status: gradio.shared.loading_status,
          as_item: gradio.props.as_item as string | undefined,
          _internal: props._internal || (gradio.props._internal as {}),
        },
        ['i18n', 'api_url', 'name', 'additional_props']
      )
    );
  };

  let additionalProps = $state(
    (() => $state.snapshot(gradio.props.additional_props) || {})() as Record<
      PropertyKey,
      any
    >
  );

  $effect(() => {
    additionalProps = {
      ...untrack(() => $state.snapshot(additionalProps)),
      ...(gradio.props.additional_props || {}),
    };
  });
  const getAdditionalProps = () => additionalProps;

  return {
    gradio,
    getComponentProps,
    getAdditionalProps,
    updateProps,
    children: props.children,
  };
}
