import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.BorderBeam(elem_style=dict(borderRadius=8)):
                with antd.Card(title="BorderBeam",
                               elem_style=dict(width=320, marginBottom=0)):
                    ms.Div("A flowing highlight runs along the border.")

if __name__ == "__main__":
    demo.queue().launch()
