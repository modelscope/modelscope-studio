import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(size="large"):
                # a solid color beam
                with antd.BorderBeam(color="#f5222d", duration=3):
                    with antd.Card(title="Solid Color",
                                   elem_style=dict(width=280, marginBottom=0)):
                        ms.Div("color='#f5222d'")
                # a gradient beam
                with antd.BorderBeam(color=[
                        dict(color="#1677ff", percent=0),
                        dict(color="#722ed1", percent=50),
                        dict(color="#eb2f96", percent=70),
                ],
                                     line_width=2,
                                     size=120):
                    with antd.Card(title="Gradient",
                                   elem_style=dict(width=280, marginBottom=0)):
                        ms.Div("color=[{color, percent}, ...]")

if __name__ == "__main__":
    demo.queue().launch()
