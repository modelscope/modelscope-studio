import json

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Row(gutter=[6, 10]):
                with antd.Col(span=6):
                    ms.Text("Col-6")
                with antd.Col(span=12):
                    ms.Text("Col-12")
                with antd.Col(span=6):
                    ms.Text("Col-6")
                with antd.Col(span=6):
                    ms.Text("Col-6")
                with antd.Col(span=12):
                    ms.Text("Col-12")
                with antd.Col(span=6):
                    ms.Text("Col-6")
if __name__ == "__main__":
    demo.queue().launch()
