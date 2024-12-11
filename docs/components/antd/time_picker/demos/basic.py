import time

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction='vertical'):
                antd.TimePicker()
                antd.TimePicker(format="HH:mm")
                antd.TimePicker(minute_step=15,
                                second_step=10,
                                hour_step=1,
                                need_confirm=True)
            antd.Divider("12 hours")
            with antd.Space(direction='vertical'):
                antd.TimePicker(use_12_hours=True)
                antd.TimePicker(use_12_hours=True, format="h:mm:ss A")
                antd.TimePicker(use_12_hours=True, format="h:mm a")
            antd.Divider("Prefix and Suffix")
            with antd.Space(direction='vertical'):
                with antd.TimePicker():
                    with ms.Slot("suffixIcon"):
                        antd.Icon("SmileOutlined")
                with antd.TimePicker():
                    with ms.Slot("prefix"):
                        antd.Icon("SmileOutlined")
if __name__ == "__main__":
    demo.queue().launch()
