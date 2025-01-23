import gradio as gr
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with ms.Div(elem_style=dict(color="red", fontSize=22)):
            ms.Text("Hello Div")

if __name__ == "__main__":
    demo.queue().launch()
