---
'modelscope_studio': patch
---

fix: `antdx.FileCard` and `antdx.FileCard.List.Item` raise `AttributeError` when `src` is a file dict without a `url`
