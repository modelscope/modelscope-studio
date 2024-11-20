import time

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def click():
    time.sleep(2)
    yield gr.update(value="Hello"), gr.update(value="Hello")
    time.sleep(2)
    yield gr.update(value="Hello World"), gr.update(value="Hello World")


def click2():
    time.sleep(2)
    yield gr.update(value="Hello")


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with ms.AutoLoading():
                with antd.Space(direction="vertical",
                                elem_style=dict(width="100%")):
                    with ms.AutoLoading(generating=True):
                        textarea = antd.Input.Textarea()

                    with ms.AutoLoading(show_mask=True):
                        textarea2 = antd.Input.Textarea()

                    textarea3 = antd.Input.Textarea()

                    with antd.Space():
                        btn = antd.Button("Click")
                        btn2 = antd.Button("Click2")

                    btn.click(click, outputs=[textarea, textarea2])
                    btn2.click(click2, outputs=[textarea3])

if __name__ == "__main__":
    demo.queue().launch()
