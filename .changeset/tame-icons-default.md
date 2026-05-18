---
'@modelscope-studio/frontend': patch
'@modelscope-studio/antdx': patch
'modelscope_studio': patch
---

fix(antdx): resolve `Think` component React #130 error in production build

- Fix default import mapping in the Vite plugin so namespace-style globals
  (e.g. `@ant-design/icons`) correctly resolve `import X from 'mod'` to
  `<global>.default` instead of the namespace object itself.
- Forward `children` to `XThink` so user-provided content renders.
