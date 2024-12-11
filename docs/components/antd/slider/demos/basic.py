import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Slider(value=50)
            antd.Slider(range=True, value=[20, 50])
            antd.Divider("Vertical")
            antd.Slider(range=True,
                        value=[20, 50],
                        step=5,
                        vertical=True,
                        elem_style=dict(height=200))
            antd.Divider("Customize tooltip")
            antd.Slider(tooltip=dict(formatter="(value) => `${value}%`"))

if __name__ == "__main__":
    demo.queue().launch()
