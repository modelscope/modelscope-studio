import type { Plugin, PluginOption } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { join, dirname } from "path";
import { createRequire } from "module";
import { existsSync, readFileSync } from "fs";
import { type ComponentConfig } from "./dev";
import type { PreprocessorGroup } from "svelte/compiler";
import { sveltePreprocess } from "svelte-preprocess";

const svelte_codes_to_ignore: Record<string, string> = {
	"reactive-component": "Icon"
};

export function plugins(config: ComponentConfig): PluginOption[] {
	const _additional_plugins = config.plugins || [];
	const _additional_svelte_preprocess = config.svelte?.preprocess || [];
	const _svelte_extensions = (config.svelte?.extensions || [".svelte"]).map(
		(ext) => {
			if (ext.trim().startsWith(".")) {
				return ext;
			}
			return `.${ext.trim()}`;
		}
	);

	if (!_svelte_extensions.includes(".svelte")) {
		_svelte_extensions.push(".svelte");
	}

	return [
		svelte({
			inspector: false,
			onwarn(warning, handler) {
				if (
					svelte_codes_to_ignore.hasOwnProperty(warning.code) &&
					svelte_codes_to_ignore[warning.code] &&
					warning.message.includes(svelte_codes_to_ignore[warning.code])
				) {
					return;
				}
				handler!(warning);
			},
			prebundleSvelteLibraries: false,
			compilerOptions: {
				discloseVersion: false,
				hmr: true
			},
			extensions: _svelte_extensions,
			preprocess: [
				sveltePreprocess({
					typescript: {
						compilerOptions: {
							declaration: false,
							declarationMap: false
						}
					}
				}),
				...(_additional_svelte_preprocess as PreprocessorGroup[])
			]
		}),
		..._additional_plugins
	];
}

/**
 * Gradio ships two generations of app bundle, and a custom component has to be
 * wired differently for each:
 *
 *  - "shared" (Gradio <= 6.8): the app exposes its own Svelte runtime as plain
 *    modules under `templates/frontend/assets/svelte/*`. Components import that
 *    runtime, so app and component share a single instance. The app has no
 *    `__MODE__` hook and never imports `virtual:cc-init`, so the dev globals
 *    have to be injected into the page directly.
 *  - "bridge" (Gradio >= ~6.9): the runtime is inlined into the app bundle.
 *    Components bring their own instance and are mounted through it, and the
 *    app boots into custom component mode via `globalThis.__MODE__`.
 *
 * Detecting this from the app build (rather than pinning a version) keeps one
 * vendored copy working across upgrades.
 */
export type GradioGeneration = "shared" | "bridge";

export function detect_generation(root_dir: string): GradioGeneration {
	return existsSync(join(root_dir, "assets", "svelte"))
		? "shared"
		: "bridge";
}

function resolve_svelte_entry(id: string, base_dir: string): string | null {
	const require_fn = createRequire(join(base_dir, "frontend", "_"));
	try {
		const svelte_pkg_path = require_fn.resolve("svelte/package.json");
		const svelte_dir = dirname(svelte_pkg_path);
		const pkg = JSON.parse(readFileSync(svelte_pkg_path, "utf-8"));

		const subpath = id === "svelte" ? "." : "./" + id.slice("svelte/".length);

		if (pkg.exports && pkg.exports[subpath]) {
			const entry = pkg.exports[subpath];
			const resolved =
				typeof entry === "string" ? entry : entry.browser || entry.default;
			if (resolved) {
				return join(svelte_dir, resolved);
			}
		}
	} catch {
		return null;
	}
	return null;
}

interface GradioPluginOptions {
	mode: "dev" | "build";
	svelte_dir: string;
	component_dir: string;
	root_dir: string;
	backend_port?: number;
	imports?: string;
	runtimes?: string;
}

export function make_gradio_plugin({
	mode,
	backend_port,
	component_dir,
	root_dir,
	svelte_dir,
	imports,
	runtimes
}: GradioPluginOptions): Plugin {
	const v_id = "virtual:component-loader";
	const v_id_2 = "virtual:cc-init";
	const resolved_v_id = "\0" + v_id;
	const resolved_v_id_2 = "\0" + v_id_2;
	const generation = detect_generation(root_dir);
	const dev_globals = `window.__GRADIO_DEV__ = "dev";
      window.__GRADIO__SERVER_PORT__ = ${backend_port};
      window.__GRADIO__CC__ = ${imports};
      window.__GRADIO__CC__RUNTIMES__ = ${runtimes};`;
	return {
		name: "gradio",
		enforce: "pre",
		resolveId(id) {
			if (id === v_id) {
				return resolved_v_id;
			}
			if (id === v_id_2) {
				return resolved_v_id_2;
			}

			if (id.startsWith("svelte")) {
				// Point at the runtime the app itself uses, so that component and app
				// share one instance. Mixing two instances breaks snippets and
				// context: whichever runtime did not create an effect sees a `null`
				// `active_effect` as soon as rendering leaves the synchronous mount.
				if (generation === "shared") {
					const subpath =
						id === "svelte" ? "svelte" : id.slice("svelte/".length);
					const file_name = `svelte_${subpath.replace(/\//g, "_")}.js`;

					// A built component is loaded from `<template>/component/`, five
					// levels below the app's `assets/`, so the import can stay relative
					// and unbundled. The dev server has no such fixed layout: it must
					// hand Vite the real file, which is inside the served root, so that
					// the app's own chunks and the component resolve to one module.
					if (mode === "build") {
						return {
							id: `../../../../../assets/svelte/${file_name}`,
							external: true
						};
					}

					const shared_entry = join(svelte_dir, file_name);
					if (existsSync(shared_entry)) {
						return shared_entry;
					}
					// Not every subpath is exposed by the app (`svelte/compiler` for
					// one); fall back to the component's own copy for those.
				}

				const resolved = resolve_svelte_entry(id, component_dir);
				if (resolved) {
					return resolved;
				}
			}
		},
		load(id) {
			if (id === resolved_v_id) {
				return `export default {};`;
			}

			if (id === resolved_v_id_2) {
				return dev_globals;
			}
		},
		transformIndexHtml(html) {
			// Only dev mode boots the app as a custom component host.
			if (!imports) {
				return;
			}
			const tags = [
				{
					// `js/spa/src/main.ts` merely defaults `__MODE__` to `"_NORMAL_"`
					// (`??=`), so defining it up front is all it takes to switch the
					// app into custom component mode. Rewriting the marker inside the
					// bundle is brittle: the dev server serves the *published* build,
					// in which the minifier is free to emit the string with any kind
					// of quotes (it currently emits a template literal, which silently
					// made the replacement — and the whole dev server — a no-op).
					tag: "script",
					children: `globalThis.__MODE__ = "_CC_";`,
					injectTo: "head-prepend" as const
				}
			];
			// The "shared" app has no `virtual:cc-init` import, so the dev globals
			// can only reach it by being inlined here. This is safe because its
			// `__GRADIO__CC__RUNTIMES__` is empty and `__GRADIO__CC__` only holds
			// `/@fs/` URLs — no bare specifier the browser would fail to resolve.
			// The "bridge" app instead imports `virtual:cc-init` (served from
			// `load` below), where Vite rewrites the bare `import("svelte")` in
			// `__GRADIO__CC__RUNTIMES__`; inlining it here would throw
			// "Failed to resolve module specifier 'svelte'".
			if (generation === "shared") {
				tags.push({
					tag: "script",
					children: dev_globals,
					injectTo: "head-prepend" as const
				});
			}
			return {
				// The dev server hands `index.html` to the browser as is, so the
				// Jinja expressions the backend would otherwise fill in have to be
				// neutralised: `<base href="{{ base_url ... }}">` makes every relative
				// asset URL resolve against the raw template text — the app never
				// loads and the page stays blank — and the inline
				// `window.gradio_* = {{ ... }};` assignments are syntax errors. In dev
				// mode the app fetches its config from the backend, so dropping the
				// values is safe.
				html: html
					.replace(/\{\{\s*base_url[\s\S]*?\}\}/g, "./")
					.replace(/(=\s*)\{\{[\s\S]*?\}\}(\s*;)/g, "$1null$2")
					.replace(/\{\{[\s\S]*?\}\}/g, ""),
				tags
			};
		}
	};
}

// export const deepmerge_plugin: Plugin = {
//   name: "deepmerge",
//   enforce: "pre",
//   resolveId(id) {
//     if (id === "deepmerge") {
//       return "deepmerge_internal";
//     }
//   },
//   load(id) {
//     if (id === "deepmerge_internal") {
//       return deepmerge;
//     }
//   },
// };
