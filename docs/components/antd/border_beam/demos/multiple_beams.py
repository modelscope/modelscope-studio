import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(size="large"):
                for count in [1, 2, 4]:
                    with antd.BorderBeam(count=count,
                                         duration=4,
                                         elem_style=dict(borderRadius=8)):
                        with antd.Card(title=f"count={count}",
                                       elem_style=dict(width=240,
                                                       marginBottom=0)):
                            ms.Div(
                                f"{count} beam(s) evenly distributed along the border."
                            )

if __name__ == "__main__":
    demo.queue().launch()
