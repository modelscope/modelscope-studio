import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_position = "top"

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap=4, wrap=True, align="center"):
                ms.Span("Categories:")
                antd.Tag.CheckableTag("Movies", value=True)
                antd.Tag.CheckableTag("Books")
                antd.Tag.CheckableTag("Music")
                antd.Tag.CheckableTag("Sports")

if __name__ == "__main__":
    demo.queue().launch()
