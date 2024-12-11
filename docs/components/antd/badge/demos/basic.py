import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(size="middle"):
                with antd.Badge(count=5):
                    antd.Avatar(shape="square", size="large")

                with antd.Badge(count=0, show_zero=True):
                    antd.Avatar(shape="square", size="large")

                with antd.Badge(elem_style=dict(color="#f5222d")):
                    with ms.Slot("count"):
                        antd.Icon("ClockCircleOutlined")
                    antd.Avatar(shape="square", size="large")
                with antd.Badge(count=99, overflow_count=10):
                    antd.Avatar(shape="square", size="large")
                with antd.Badge(count=1000, overflow_count=999):
                    antd.Avatar(shape="square", size="large")

                with antd.Badge(dot=True):
                    antd.Icon("NotificationOutlined",
                              elem_style=dict(fontSize="16"))
            antd.Divider("Status")
            with antd.Space(direction="vertical"):
                antd.Badge(status="success", text="Success")
                antd.Badge(status="error", text="Error")
                antd.Badge(status="default", text="Default")
                antd.Badge(status="processing", text="Processing")
                antd.Badge(status="warning", text="Warning")
if __name__ == "__main__":
    demo.queue().launch()
