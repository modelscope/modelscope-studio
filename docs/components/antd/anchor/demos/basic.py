import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Row():
                with antd.Col(span=16):
                    with ms.Div(elem_style=dict(maxHeight="700px",
                                                overflow="auto")):
                        ms.Div(elem_id="part-1",
                               elem_style=dict(
                                   height="100vh",
                                   background="rgba(255,0,0,0.02)"))
                        ms.Div(elem_id="part-2",
                               elem_style=dict(
                                   height="100vh",
                                   background="rgba(0,255,0,0.02)"))
                        ms.Div(elem_id="part-3",
                               elem_style=dict(
                                   height="100vh",
                                   background="rgba(0,0,255,0.02)"))
                with antd.Col(span=8):
                    with antd.Anchor():
                        with antd.Anchor.Item(href="#part-1", key="part-1"):
                            with ms.Slot("title"):
                                antd.Typography.Title("Part 1")
                        antd.Anchor.Item(title="Part 2",
                                         href="#part-2",
                                         key="part-2")
                        antd.Anchor.Item(title="Part 3",
                                         href="#part-3",
                                         key="part-3")

if __name__ == "__main__":
    demo.queue().launch()
