import time

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def click():
    time.sleep(2)
    yield gr.update(value="Hello")


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with ms.AutoLoading():
                textarea = antd.Input.Textarea()

                btn = antd.Button("Click")
                btn.click(click, outputs=[textarea])

if __name__ == "__main__":
    demo.queue().launch()
