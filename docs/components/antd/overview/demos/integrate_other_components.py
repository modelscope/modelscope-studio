import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                antd.Button("1")
                antd.Button("2")
                # other gradio components
                with ms.Fragment():
                    gr.Button("3")

if __name__ == "__main__":
    demo.queue().launch()
