import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                antd.ColorPicker(value="#816DF8")
                antd.ColorPicker(value="#816DF8", show_text=True)
                antd.ColorPicker(value=[
                    {
                        "color": 'rgb(16, 142, 233)',
                        "percent": 0,
                    },
                    {
                        "color": 'rgb(135, 208, 104)',
                        "percent": 100,
                    },
                ],
                                 show_text=True,
                                 allow_clear=True,
                                 mode="gradient")
if __name__ == "__main__":
    demo.queue().launch()
