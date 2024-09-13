import type { Gradio } from '@gradio/utils';

export async function initialize() {
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

export function bindEvents<
  T extends {
    gradio: Gradio;
    _internal: Record<string, any>;
    props: Record<string, any>;
  },
>(props: T) {
  const { gradio, _internal: internal, ...component } = props;

  return Object.keys(internal).reduce(
    (acc, key) => {
      const matched = key.match(/bind_(.+)_event/);
      if (matched) {
        const event = matched[1];
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
          return gradio.dispatch(
            event.replace(/[A-Z]/g, (letter) => '_' + letter.toLowerCase()),
            {
              payload,
              component,
            }
          );
        };

        if (splitted.length > 1) {
          let value: Record<PropertyKey, any> = {
            ...(component.props[splitted[0]] || {}),
          };
          acc[splitted[0]] = value;
          for (let i = 1; i < splitted.length - 1; i++) {
            const prop = {
              ...(component.props[splitted[i]] || {}),
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
      }
      return acc;
    },
    {} as Record<string, any>
  );
}
