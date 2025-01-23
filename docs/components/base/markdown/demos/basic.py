import gradio as gr
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        ms.Markdown("`Hello Markdown`")

if __name__ == "__main__":
    demo.queue().launch()
