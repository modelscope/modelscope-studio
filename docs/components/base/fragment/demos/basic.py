import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Divider("Without Fragment")
            with antd.Space():
                antd.Button("Antd Button")
                antd.Button("Antd Button")
                gr.Button("Gradio Button")
            antd.Divider("With Fragment")
            with antd.Space():
                antd.Button("Antd Button")
                antd.Button("Antd Button")
                with ms.Fragment():
                    gr.Button("Gradio Button")

if __name__ == "__main__":
    demo.queue().launch()
