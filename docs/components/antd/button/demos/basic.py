import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="small", wrap=True):
                btn = antd.Button("Primary Button", type="primary")
                btn.click(lambda: print("clicked"))
                with antd.Button():
                    ms.Text("Default Button")
                antd.Button("Dashed Button", type="dashed")
                antd.Button("Text Button", type="text")
                antd.Button("Link Button", type="link")
                antd.Button("Filled", color="default", variant="filled")
                antd.Button("Filled", color="danger", variant="filled")
                with antd.Button(type="primary", loading=True):
                    ms.Text("Loading")
                    with ms.Slot("icon"):
                        antd.Icon("PoweroffOutlined")
                antd.Button("Block", type="primary", block=True)

if __name__ == "__main__":
    demo.queue().launch()
