---
'@modelscope-studio/frontend': patch
'modelscope_studio': patch
---

fix: components stop updating after the first render in the production build, e.g. revisited tabs or menu items no longer switch the content and `ms.AutoLoading` no longer shows up
