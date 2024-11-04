import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="small", wrap=True):
                antd.Button("Primary Button", type="primary")
                with antd.Button():
                    ms.Text("Default Button")
                antd.Button("Dashed Button", type="dashed")
                antd.Button("Text Button", type="text")
                antd.Button("Link Button", type="link")

if __name__ == "__main__":
    demo.queue().launch()
