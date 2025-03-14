import gradio as gr
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro


def submit(input_value):
    print(input_value)


with gr.Blocks() as demo, ms.Application(), antdx.XProvider():
    input = pro.MultimodalInput()
    input.submit(fn=submit, inputs=[input])

if __name__ == "__main__":
    demo.queue().launch()
