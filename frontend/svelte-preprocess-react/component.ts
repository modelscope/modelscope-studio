import type { Gradio } from '@gradio/utils';
import { convertToCamelCase } from '@utils/convertToCamelCase';
import { isPlainObject, mapKeys, omit } from 'lodash-es';

export async function initialize() {
  if (!window.ms_globals) {
    window.ms_globals = {} as typeof window.ms_globals;
  }
  if (!window.ms_globals.initializePromise) {
    window.ms_globals.initializePromise = new Promise((resolve) => {
      window.ms_globals.initialize = () => {
        resolve();
      };
    });
  }
  await window.ms_globals.initializePromise;
}

export async function importComponent<T extends { default: any }>(
  importer: () => Promise<T>
): Promise<T['default']> {
  await initialize();
  return importer().then((m) => m.default);
}

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
const gradioProps = skippedGradioProps.concat(['attached_events']);

export function mapProps<T extends Record<string, any>>(
  props: T,
  mapping: Record<keyof T, string> = {} as Record<keyof T, string>,
  skipGradioProps = false
) {
  return mapKeys(
    omit(props, skipGradioProps ? [] : skippedGradioProps),
    (_, key) => {
      return mapping[key] || convertToCamelCase(key);
    }
  );
}

export function bindEvents<
  T extends {
    gradio: Gradio;
    _internal: Record<string, any>;
    props: Record<string, any>;
    restProps?: Record<string, any>;
    originalRestProps?: Record<string, any>;
  },
>(props: T, eventsMapping?: Record<string, string>) {
  const {
    gradio,
    _internal: internal,
    restProps,
    originalRestProps,
    ...component
  } = props;
  // gradio props
  const attachedEvents: string[] = restProps?.attachedEvents || [];

  return {
    ...Array.from(
      new Set([
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
          if (eventsMapping && eventsMapping[event]) {
            return eventsMapping[event];
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
                ...omit(originalRestProps, gradioProps),
              },
            }
          );
        };

        if (splitted.length > 1) {
          let value: Record<PropertyKey, any> = {
            ...(component.props[splitted[0]] || restProps?.[splitted[0]] || {}),
          };
          acc[splitted[0]] = value;
          for (let i = 1; i < splitted.length - 1; i++) {
            const prop = {
              ...(component.props[splitted[i]] ||
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
    __render_eventProps: {
      props,
      eventsMapping,
    },
  };
}
