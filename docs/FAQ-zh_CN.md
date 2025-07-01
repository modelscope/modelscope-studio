# FAQ

## 为什么我的应用在本地可以正常运行，在 Hugging Face Space 中界面无法正常显示？

在 Hugging Face Space 中，默认开启了 Gradio 的 ssr 模式，但是此功能目前还无法很好的兼容自定义组件，需要我们手动关闭。请在`demo.launch()`方法中添加`ssr_mode=False`参数：`demo.launch(ssr_mode=False)`。

## 为什么我的应用每次操作都需要等待一小段时间才会有响应

`modelscope_studio`将组件的加载反馈进行了单独抽离。由于 Gradio 的交互操作涉及到前后端通信，需要有一段加载中的等待时间，当没有`AutoLoading`组件时，页面将不会显示 Gradio 的加载状态。因此，建议您至少在全局使用一次`AutoLoading`组件，以显示兜底的加载反馈。

```python
import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application(), antd.ConfigProvider(), ms.AutoLoading():
        antd.Button()
```
