# @modelscope-studio/gradio-preview

Vendored copy of [`@gradio/preview`](https://github.com/gradio-app/gradio/tree/main/js/preview),
the Vite layer behind `gradio cc dev` and `gradio cc build`.

It is vendored because the upstream package is tightly coupled to the Gradio app
bundle it drives, and the two have drifted: several dev-server problems can only
be fixed from inside this package (the `virtual:cc-init` module, the index-html
bootstrap, the build entry composition, the Vite version it ships with).

## Why not just pin a stock `@gradio/preview`?

- **`0.17.0` (Gradio 6.9+/6.23 era)** ships the right Vite (`vite ^8`,
  `@sveltejs/vite-plugin-svelte ^7`) but has the dev-bootstrap bugs listed below.
- **`0.15.2` (Gradio <= 6.8 era)** boots the shared-runtime app correctly but
  depends on `vite ^7` / `@sveltejs/vite-plugin-svelte ^6`, which is incompatible
  with this repo's `vite 8` (rolldown) toolchain — it fails with
  `Missing field 'moduleType'`.

So this package takes the `0.17.0` source (for the `vite 8` deps + fixes) and
makes it work across both Gradio generations via `detect_generation`.

## Vendor baseline

| | |
| --- | --- |
| Upstream | `gradio-app/gradio` `js/preview` |
| Version | `0.17.0` |
| Commit | `a9e8382c4` |
| Deps | `vite ^8`, `@sveltejs/vite-plugin-svelte ^7` (kept from `0.17.0`) |

Re-syncing means diffing `src/` against that path upstream, taking their changes
and re-applying the fixes below, then `pnpm -F @modelscope-studio/gradio-preview build`.

## Local fixes

1. **Dev bootstrap works on every Gradio generation.** The dev globals
   (`__GRADIO_DEV__`, `__GRADIO__SERVER_PORT__`, `__GRADIO__CC__`,
   `__GRADIO__CC__RUNTIMES__`) are injected into the page via
   `transformIndexHtml`. Upstream only rewrites a `"_NORMAL_"` marker inside the
   *built* app bundle, which silently misses when the minifier emits it as a
   template literal (Gradio 6.23) and does not exist at all in Gradio <= 6.8 —
   in both cases the app falls back to its own origin and asks the dev server
   for `/config`, which answers with HTML.
2. **The Jinja template is neutralised.** The dev server hands `index.html` to
   the browser unrendered, so `<base href="{{ base_url ... }}">` (Gradio 6.9+)
   would make every relative asset URL resolve against the raw template text
   (blank page), and the inline `window.gradio_* = {{ ... }};` assignments are
   syntax errors.
3. **Backend-owned routes are proxied** (`theme.css`, `manifest.json`,
   `gradio_api`, `custom_component`). `theme.css` is resolved against the
   document, so without this the app loads a stylesheet with zero rules and
   renders with no Gradio CSS variables at all.
4. **Generation detection** (`detect_generation`), driving both dev and build:
   - `shared` (Gradio <= 6.8) — the app exposes its runtime under
     `assets/svelte/*`; components resolve `svelte` to it and share one instance.
     `__GRADIO__CC__RUNTIMES__` is left empty and no per-component runtime entry
     is built.
   - `bridge` (Gradio >= ~6.9) — the runtime is inlined in the app bundle;
     components bring their own and are mounted through `svelte_runtime_entry.js`.

   Mixing two runtime instances is what makes a snippet blow up with
   `Cannot read properties of null (reading 'nodes')` as soon as rendering leaves
   the synchronous `mount` call.
5. **`Pre-transform error` is no longer swallowed.** Upstream drops it from the
   logger, which turns a failing module into an app that hangs with no output.

## Consumer constraints (outside this package)

`detect_generation` picks the right dev/build strategy, but it cannot fix
version-contract mismatches between the components and the Gradio app they run
against. When changing the target Gradio version, also align, in the repo root
and `frontend/`:

- **`svelte`** must match the version Gradio bundles for the *shared* runtime
  (`.../gradio/templates/frontend/assets/svelte/svelte_package.json.js`).
  A newer compiler emits `$$restProps` excludes as a `Set` while an older
  runtime expects an array, which throws
  `target.exclude.includes is not a function`. Pin it repo-wide via
  `pnpm.overrides.svelte` so a single version is resolved everywhere.
- **`@gradio/utils`** must match the app's registration contract: Gradio <= 6.8
  provides `register` via a Svelte context (`@gradio/utils` 0.11.x), Gradio 6.23
  provides `register_component` via `shared_props` (`@gradio/utils` 0.14.x). The
  wrong one silently no-ops registration and the app hangs on its loading screen.

Currently validated against **Gradio 6.8.0** (`shared`): `@gradio/utils@0.11.3`,
`@gradio/client@2.1.0`, `@gradio/statustracker@^0.13.1`, `svelte@5.48.0`.

## License

Derived from Gradio, licensed under Apache-2.0. See `NOTICE`.
