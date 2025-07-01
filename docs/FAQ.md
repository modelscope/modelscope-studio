# FAQ

## Why does my application run normally locally but the interface doesn't display properly in Hugging Face Space?

In Hugging Face Space, Gradio's SSR mode is enabled by default, but this feature currently doesn't work well with custom components and needs to be manually disabled. Please add the `ssr_mode=False` parameter to the `demo.launch()`: `demo.launch(ssr_mode=False)`.

## Why does my application need to wait for a short time before responding to each operation?

`modelscope_studio` has separately extracted the loading feedback for components. Since Gradio's interactive operations involve frontend-backend communication, there needs to be a loading wait time. When there is no `AutoLoading` component, the page will not display Gradio's loading status. Therefore, it is recommended that you use the `AutoLoading` component at least once globally to display fallback loading feedback.

```python
import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application(), antd.ConfigProvider(), ms.AutoLoading():
        antd.Button()
```
