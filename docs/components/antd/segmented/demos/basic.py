import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.Segmented(options=[
                    'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'
                ])
                antd.Segmented(options=[
                    'Daily',
                    {
                        "label": 'Weekly',
                        "value": 'Weekly',
                        "disabled": True
                    },
                    'Monthly',
                    {
                        "label": 'Quarterly',
                        "value": 'Quarterly',
                        "disabled": True
                    },
                    'Yearly',
                ])
                with antd.Segmented():
                    with antd.Segmented.Option(value="user1"):
                        with ms.Slot("label"):
                            with ms.Div():
                                antd.Avatar(
                                    "https://api.dicebear.com/7.x/miniavs/svg?seed=8"
                                )
                                ms.Div("User 1")
                    with antd.Segmented.Option(value="user2"):
                        with ms.Slot("label"):
                            with ms.Div(elem_style=dict(padding=4)):
                                with antd.Avatar(elem_style=dict(
                                        backgroundColor="#f56a00")):
                                    ms.Text("K")
                                ms.Div("User 2")
                    with antd.Segmented.Option(value="user3"):
                        with ms.Slot("label"):
                            with ms.Div(elem_style=dict(padding=4)):
                                with antd.Avatar(elem_style=dict(
                                        backgroundColor="#87d068")):
                                    with ms.Slot("icon"):
                                        antd.Icon("UserOutlined")
                                ms.Div("User 3")

if __name__ == "__main__":
    demo.queue().launch()
