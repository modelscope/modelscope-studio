import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.Select(elem_style=dict(width=200),
                            allow_clear=True,
                            options=[
                                {
                                    "value": 'jack',
                                    "label": 'Jack'
                                },
                                {
                                    "value": 'lucy',
                                    "label": 'Lucy'
                                },
                                {
                                    "value": 'Yiminghe',
                                    "label": 'yiminghe'
                                },
                                {
                                    "value": 'disabled',
                                    "label": 'Disabled',
                                    "disabled": True
                                },
                            ])
                # custom label
                with antd.Select(
                        elem_style=dict(width=200),
                        mode="multiple",
                ):
                    with antd.Select.Option(value="jack"):
                        with ms.Slot("label"):
                            antd.Tag("Jack", color="red")
                    with antd.Select.Option(value="lucy"):
                        with ms.Slot("label"):
                            antd.Tag("Lucy", color="green")
                    with antd.Select.Option(value="Yiminghe"):
                        with ms.Slot("label"):
                            antd.Tag("Yiminghe", color="blue")
                    with antd.Select.Option(value="disabled", disabled=True):
                        with ms.Slot("label"):
                            antd.Tag("Disabled", color="gray")

if __name__ == "__main__":
    demo.queue().launch()
