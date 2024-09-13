import gradio as gr
import modelscope_studio as mgr


def fn(value):
    print(value.text, value.files)


with gr.Blocks() as demo:
    input = mgr.MultimodalInput(upload_button_props=dict(variant="primary"),
                                submit_button_props=dict(visible=False))
    input.change(fn=fn, inputs=[input])

if __name__ == "__main__":
    demo.queue().launch()
