---
'@modelscope-studio/antdx': patch
'modelscope_studio': patch
---

feat: sync antdx APIs from 2.7.0 to 2.9.0

- `Folder`: new `context_menu` (items or JS function string) and `right_click` event
- `Folder.TreeNode`: new `context_menu` (items or `False` to disable per-node)
- `Think` and `ThoughtChain.ThoughtChainItem`: new `destroy_on_hidden`
