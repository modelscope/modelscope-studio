import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms


def fn(value):
    print(value.text, value.files)


with gr.Blocks() as demo, ms.Application():
    input = mgr.MultimodalInput(upload_button_props=dict(variant="primary"),
                                submit_button_props=dict(visible=False))
    input.change(fn=fn, inputs=[input])

if __name__ == "__main__":
    demo.queue().launch()
