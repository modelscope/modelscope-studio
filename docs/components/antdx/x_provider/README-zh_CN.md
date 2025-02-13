# XProvider

Provide a uniform configuration support for x components.. See [Ant Design X](https://x.ant.design/components/x-provider/) for more information.

The `XProvider` extends the `ConfigProvider` from antd and provides global configuration for components in `@ant-design/x`.

If you are already using `ConfigProvider` from antd, please make the following changes to your code:

```python
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
  with ms.Application():
-    with antd.ConfigProvider():
+    with antdx.XProvider():
```
