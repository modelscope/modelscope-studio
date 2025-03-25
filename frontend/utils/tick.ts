export function tick() {
  window.ms_globals ??= {} as typeof window.ms_globals;

  let promise = window.ms_globals.tickPromise;
  if (!promise) {
    promise = window.ms_globals.tickPromise = Promise.resolve();
    promise.then(() => {
      window.ms_globals.tickPromise = null;
    });
  }
  return promise;
}
