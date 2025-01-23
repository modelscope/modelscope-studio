import gradio as gr
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr


def fn(value):
    # value includes `text`` and `files``
    print(value.text, value.files)


with gr.Blocks() as demo, ms.Application():
    input = mgr.MultimodalInput()
    input.change(fn=fn, inputs=[input])

if __name__ == "__main__":
    demo.queue().launch()
