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
