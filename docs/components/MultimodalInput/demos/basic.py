import gradio as gr
import modelscope_studio as mgr


def fn(value):
    # value includes `text`` and `files``
    print(value.text, value.files)


with gr.Blocks() as demo:
    input = mgr.MultimodalInput()
    input.change(fn=fn, inputs=[input])

if __name__ == "__main__":
    demo.queue().launch()
