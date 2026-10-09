import path from 'node:path';
import url from 'node:url';

// `gradio cc dev` hands every custom component the same `import("svelte")`, so
// they all run on one Svelte runtime. `gradio cc build` (bridge generation,
// Gradio >= 6.9) instead bundles a private runtime into each component. Our
// components are not independent though: the React tree created by the first
// one watches the `$state` props of all the others
// (`svelte-preprocess-react/internal/Bridge.svelte.ts`), and a runtime never
// tracks signals owned by another one, so prop updates stop re-rendering in the
// build (visited tabs never switch back, AutoLoading never shows up).
//
// To restore the dev behaviour:
//   - the provider (`ms.Application`) imports `virtual:ms-svelte-runtime` from
//     `inject.ts`, which bundles every entry below and hands them over through
//     `window.ms_globals.svelteRuntime`;
//   - the consumers (every other component) resolve their `svelte` imports to
//     facades that wait for it (top-level await) and re-export its bindings.
//
// Unlike `./globals.js`, the imports cannot be turned into plain
// `window.ms_globals.*` reads: the Svelte compiler and Gradio's
// `svelte_runtime_entry.js` use the runtime as soon as a component module is
// evaluated, and Gradio does not evaluate `ms.Application` first.
//
// When Svelte adds a client entry, add it to `sharedEntries` (or
// `flagEntries`), the build fails on any unlisted one a consumer imports.

const RUNTIME_ID = 'virtual:ms-svelte-runtime';
const RESOLVED_RUNTIME_ID = '\0' + RUNTIME_ID;
// `window.ms_globals.svelteRuntime`, shared by the provider and the consumers.
const RUNTIME_STATE_ID = '\0ms-svelte-runtime-state';
const FACADE_PREFIX = '\0ms-svelte-facade:';

// Every public client entry a component may import. The provider registers all
// of them, so whichever entry a consumer needs comes from the same runtime.
const sharedEntries = [
  'svelte',
  'svelte/animate',
  'svelte/attachments',
  'svelte/easing',
  'svelte/events',
  'svelte/internal/client',
  'svelte/legacy',
  'svelte/motion',
  'svelte/reactivity',
  'svelte/reactivity/window',
  'svelte/store',
  'svelte/transition',
];
// Side-effect only entries that switch a flag of the runtime on. Consumers
// call the flag function themselves, so a flag is only on when some component
// asks for it, as in dev.
const flagEntries = {
  'svelte/internal/flags/async': 'enable_async_mode_flag',
  'svelte/internal/flags/legacy': 'enable_legacy_mode_flag',
  'svelte/internal/flags/tracing': 'enable_tracing_mode_flag',
};
// Side-effect only entry that registers the version on `window.__svelte`, the
// provider already does it.
const DISCLOSE_VERSION_ENTRY = 'svelte/internal/disclose-version';

// Entries that never reach the client runtime.
const serverEntries = [
  'svelte/compiler',
  'svelte/server',
  'svelte/internal/server',
];

function isSvelteEntry(source) {
  return source === 'svelte' || source.startsWith('svelte/');
}

function isSharedEntry(source) {
  return (
    sharedEntries.includes(source) ||
    Object.hasOwn(flagEntries, source) ||
    source === DISCLOSE_VERSION_ENTRY
  );
}

const runtimeStateCode = `
const ms_globals = (window.ms_globals ??= {});
if (!ms_globals.svelteRuntime) {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  ms_globals.svelteRuntime = { promise, resolve };
}
export default ms_globals.svelteRuntime;
`;
const importRuntimeState = `import runtime from ${JSON.stringify(RUNTIME_STATE_ID)};`;

const moduleExportNames = new Map();
// The facade has to list the bindings it re-exports, read them from the module
// the consumer would have bundled.
function getModuleExportNames(file) {
  if (!moduleExportNames.has(file)) {
    moduleExportNames.set(
      file,
      import(url.pathToFileURL(file).href).then((m) => Object.keys(m))
    );
  }
  return moduleExportNames.get(file);
}

/**
 * @type {(context: import('rollup').PluginContext, id: string) => Promise<string>}
 */
async function loadProvider(context, id) {
  const legacyFlag = await context.resolve('svelte/internal/flags/legacy', id);
  // The "shared" Gradio generation (<= 6.8) already points `svelte` at the
  // app's own runtime.
  if (!legacyFlag || legacyFlag.external) {
    return 'export {};';
  }
  // Not a public entry, but the module holding the flags that the
  // `svelte/internal/flags/*` entries switch on.
  const flagsFile = path.join(path.dirname(legacyFlag.id), 'index.js');
  return [
    importRuntimeState,
    `import ${JSON.stringify(DISCLOSE_VERSION_ENTRY)};`,
    ...sharedEntries.map(
      (entry, i) => `import * as m${i} from ${JSON.stringify(entry)};`
    ),
    `import * as flags from ${JSON.stringify(flagsFile)};`,
    `runtime.resolve({ modules: { ${sharedEntries
      .map((entry, i) => `${JSON.stringify(entry)}: m${i}`)
      .join(', ')} }, flags });`,
  ].join('\n');
}

/**
 * @type {(source: string, file: string | undefined) => Promise<string>}
 */
async function loadFacade(source, file) {
  const lines = [
    importRuntimeState,
    'const { modules, flags } = await runtime.promise;',
  ];
  if (Object.hasOwn(flagEntries, source)) {
    lines.push(`flags.${flagEntries[source]}();`);
  } else if (source !== DISCLOSE_VERSION_ENTRY) {
    const names = await getModuleExportNames(file);
    lines.push(`const m = modules[${JSON.stringify(source)}];`);
    names.forEach((name, i) => {
      lines.push(`const e${i} = m[${JSON.stringify(name)}];`);
    });
    lines.push(
      `export { ${names.map((name, i) => `e${i} as ${name}`).join(', ')} };`
    );
  }
  return lines.join('\n');
}

/**
 * Share the provider's Svelte runtime with every consumer in the build.
 *
 * @type {(options: { consumer: boolean }) => import('vite').Plugin}
 */
export function sharedSvelteRuntimePlugin({ consumer }) {
  // facade source -> the module the consumer would have bundled
  const facadeTargets = new Map();
  let isBuild = false;
  return {
    name: 'modelscope-studio-shared-svelte-runtime',
    enforce: 'pre',
    configResolved(config) {
      isBuild = config.command === 'build';
    },
    async resolveId(source, importer, options) {
      if (source === RUNTIME_ID) {
        return RESOLVED_RUNTIME_ID;
      }
      if (source === RUNTIME_STATE_ID) {
        return source;
      }
      if (
        !isBuild ||
        !consumer ||
        importer === RESOLVED_RUNTIME_ID ||
        !isSvelteEntry(source) ||
        serverEntries.includes(source)
      ) {
        return;
      }
      if (!isSharedEntry(source)) {
        this.error(
          `"${source}" is not shared with ms.Application, add it to \`sharedEntries\` in ${url.fileURLToPath(import.meta.url)}.`
        );
      }
      const resolved = await this.resolve(source, importer, {
        ...options,
        skipSelf: true,
      });
      // The "shared" Gradio generation (<= 6.8) already points `svelte` at the
      // app's own runtime.
      if (!resolved || resolved.external) {
        return resolved;
      }
      facadeTargets.set(source, resolved.id);
      return FACADE_PREFIX + source;
    },
    load(id) {
      if (id === RUNTIME_STATE_ID) {
        return runtimeStateCode;
      }
      if (id === RESOLVED_RUNTIME_ID) {
        // dev already runs every component on one runtime
        return isBuild ? loadProvider(this, id) : 'export {};';
      }
      if (id.startsWith(FACADE_PREFIX)) {
        const source = id.slice(FACADE_PREFIX.length);
        return loadFacade(source, facadeTargets.get(source));
      }
    },
  };
}
