import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Slider(
                marks={
                    "0": '0°C',
                    "26": '26°C',
                    "37": '37°C',
                    "100": {
                        "style": {
                            "color": '#f50'
                        },
                        "label": "100°C",
                    },
                })
            with antd.Slider():
                with ms.Slot("marks"):
                    antd.Slider.Mark(
                        number=0,
                        label="0°C",
                    )
                    antd.Slider.Mark(
                        number=26,
                        label="26°C",
                    )
                    antd.Slider.Mark(
                        number=37,
                        label="37°C",
                    )
                    with antd.Slider.Mark(
                            number=100,
                            elem_style=dict(width=40),
                    ):
                        with ms.Slot("label"):
                            antd.Typography.Text("100°C", type="success")

if __name__ == "__main__":
    demo.queue().launch()
