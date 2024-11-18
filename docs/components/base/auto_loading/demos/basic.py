import time

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def click():
    time.sleep(2)
    yield gr.update(value="Hello")
    time.sleep(2)
    yield gr.update(value="Hello World")


with gr.Blocks() as demo:
    with ms.Application():
        with ms.AutoLoading(generating=True, show_mask=True):
            textarea = antd.Input.Textarea()
            btn = antd.Button("Click")
            btn.click(click, outputs=[textarea])

if __name__ == "__main__":
    demo.queue().launch()
