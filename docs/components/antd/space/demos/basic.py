import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                antd.Button("Primary", type="primary")
                antd.Button("Default")
                antd.Button("Dashed", type="dashed")
                ms.Text("Space")
if __name__ == "__main__":
    demo.queue().launch()
