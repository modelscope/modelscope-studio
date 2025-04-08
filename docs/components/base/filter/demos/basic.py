import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{"value": "Hello"}, {"value": "World"}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.Divider("Without Filter")
                with ms.Each(value=data):
                    antd.Button("Run")
                antd.Divider("With Filter")
                with ms.Each(value=data):
                    with ms.Filter():
                        antd.Button("Run")

if __name__ == "__main__":
    demo.queue().launch()
