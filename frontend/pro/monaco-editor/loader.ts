function getMonacoLoader() {
  return new Promise<{
    loader: typeof window.ms_globals.monacoLoader;
    done?: () => void;
  }>((resolve) => {
    if (!window.ms_globals?.monacoLoader) {
      if (window.ms_globals?.monacoLoaderPromise) {
        window.ms_globals.monacoLoaderPromise.then((loader) => {
          resolve({
            loader,
          });
        });
      } else {
        window.ms_globals ??= {} as typeof window.ms_globals;
        window.ms_globals.monacoLoaderPromise = new Promise((resolve2) => {
          import('@monaco-editor/react').then((m) => {
            window.ms_globals.monacoLoader = m.loader;
            resolve({
              loader: m.loader,
              done: () => resolve2(m.loader),
            });
          });
        });
      }
    } else {
      resolve({
        loader: window.ms_globals.monacoLoader,
      });
    }
  });
}
export async function initLocalLoader() {
  const { loader: monacoLoader, done } = await getMonacoLoader();

  if (!done) {
    return;
  }
  const [monaco, editorWorker, cssWorker, htmlWorker, jsonWorker, tsWorker] =
    await Promise.all([
      import('monaco-editor'),
      import('monaco-editor/esm/vs/editor/editor.worker?worker').then(
        (m) => m.default
      ),
      import('monaco-editor/esm/vs/language/css/css.worker?worker').then(
        (m) => m.default
      ),
      import('monaco-editor/esm/vs/language/html/html.worker?worker').then(
        (m) => m.default
      ),
      import('monaco-editor/esm/vs/language/json/json.worker?worker').then(
        (m) => m.default
      ),
      import('monaco-editor/esm/vs/language/typescript/ts.worker?worker').then(
        (m) => m.default
      ),
    ]);

  window.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        return new tsWorker();
      }
      return new editorWorker();
    },
  };

  if (monacoLoader) {
    monacoLoader.config({
      monaco,
    });
  }

  done();
}

export async function initCDNLoader(cdn: string) {
  const { loader: monacoLoader, done } = await getMonacoLoader();
  if (!done) {
    return;
  }

  if (monacoLoader) {
    monacoLoader.config({
      paths: {
        vs: cdn,
      },
    });
  }
  done();
}
