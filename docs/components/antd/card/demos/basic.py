import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical", size=16):
                with antd.Card(title="Default size card",
                               elem_style=dict(width=300)):
                    with ms.Slot("extra"):
                        antd.Button("More", type="link", href="#")
                    ms.Div("Card content")
                    ms.Div("Card content")
                    ms.Div("Card content")
                with antd.Card(title="Small size card",
                               elem_style=dict(width=300),
                               size="small",
                               bordered=False):
                    with ms.Slot("extra"):
                        antd.Button("More", type="link", href="#")
                    ms.Div("Card content")
                    ms.Div("Card content")
                    ms.Div("Card content")

if __name__ == "__main__":
    demo.queue().launch()
