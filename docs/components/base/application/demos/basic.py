import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Button("Primary Button", type="primary")
            antd.Divider()
            antd.Input()

if __name__ == "__main__":
    demo.queue().launch()
