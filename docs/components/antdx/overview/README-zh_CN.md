# 概览

`modelscope_studio`集成了 [Ant Design X](https://x.ant.design/) 的组件，并支持大部分的组件属性，您只需要引入`antdx`模块即可直接使用。

```python
import modelscope_studio.components.antdx as antdx
```

## 快速开始

<demo name="quick_start"></demo>

注意：其中`ms.Application`与`antdx.XProvider`（或者`antd.ConfigProvider`）是必须的，`ms.AutoLoading`为可选。

- `Application` 包含了`modelscope_studio`中所有的组件依赖，请确保`modelscope_studio`所有导出的组件都被其包裹，否则页面将会无法成功预览。
- `XProvider`（`ConfigProvider`） 与 Ant Design X（Ant Design）中的功能一致，除此之外，我们还加了一些额外的适配来兼容 Gradio 的样式。因此，为了保证页面样式正常，所有的`antdx`组件需要包裹在该组件下。
- `AutoLoading`会在`Gradio`前端发送请求时自动为被包裹的内容添加加载动画。该组件会自动收集子组件的加载状态，建议至少在全局使用一次此组件，以显示兜底的加载反馈。

## 其他

同`Antd`组件。
