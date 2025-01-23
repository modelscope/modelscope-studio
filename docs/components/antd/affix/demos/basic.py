import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Affix(offset_top=100):
                antd.Button("Affix to top", type="primary")
            antd.Divider()
            with antd.Affix(offset_bottom=100):
                antd.Button("Affix to bottom", type="primary")

if __name__ == "__main__":
    demo.queue().launch()
