import fs from 'node:fs';
import path from 'node:path';

// `@ant-design/x`'s CodeHighlighter loads its languages with
// import(`react-syntax-highlighter/dist/esm/languages/prism/${lang}`). The
// bundler only expands relative template imports, so the bare specifier reaches
// the browser as is and fails to resolve. The same module lazy-loads the full
// Prism build as well (`refractor/all`, which holds every language), so mapping
// the languages statically costs no extra size.
const LANGUAGES_DIR = 'react-syntax-highlighter/dist/esm/languages/prism';
const LANGUAGE_IMPORT_RE =
  /import\(\s*`react-syntax-highlighter\/dist\/esm\/languages\/prism\/\$\{([^`}]+)\}`\s*\)/g;
const NON_LANGUAGE_FILES = ['index.js', 'supported-languages.js'];

/**
 * @type {() => import('vite').Plugin}
 */
export function prismLanguagesPlugin() {
  return {
    name: 'modelscope-studio-prism-languages',
    apply: 'build',
    async transform(code, id) {
      if (!code.includes(`${LANGUAGES_DIR}/\${`)) {
        return;
      }
      const transformed = code.replace(
        LANGUAGE_IMPORT_RE,
        (_, lang) => `__ms_load_prism_language(${lang})`
      );
      if (transformed === code) {
        return;
      }
      const resolved = await this.resolve(`${LANGUAGES_DIR}/index.js`, id);
      if (!resolved) {
        return;
      }
      const dir = path.dirname(resolved.id);
      const languages = fs
        .readdirSync(dir)
        .filter(
          (file) => file.endsWith('.js') && !NON_LANGUAGE_FILES.includes(file)
        )
        .map((file) => file.slice(0, -'.js'.length));
      return {
        code: [
          ...languages.map(
            (lang, i) =>
              `import __ms_prism_language_${i} from ${JSON.stringify(path.join(dir, `${lang}.js`))};`
          ),
          `const __ms_prism_languages = { ${languages
            .map(
              (lang, i) => `${JSON.stringify(lang)}: __ms_prism_language_${i}`
            )
            .join(', ')} };`,
          'const __ms_load_prism_language = (lang) =>',
          '  Object.hasOwn(__ms_prism_languages, lang)',
          '    ? Promise.resolve({ default: __ms_prism_languages[lang] })',
          '    : Promise.reject(new Error(`Unknown Prism language: ${lang}`));',
          transformed,
        ].join('\n'),
        map: null,
      };
    },
  };
}
