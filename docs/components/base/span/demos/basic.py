import gradio as gr
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with ms.Span(elem_style=dict(color="red", fontSize=22)):
            ms.Text("Hello Span")

if __name__ == "__main__":
    demo.queue().launch()
