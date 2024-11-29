import time

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.DatePicker()
                antd.DatePicker(picker="week")
                antd.DatePicker(picker="month")
                antd.DatePicker(picker="quarter")
                antd.DatePicker(picker="year")
            antd.Divider("Preset Date")
            antd.DatePicker(
                need_confirm=True,
                presets=[
                    {
                        "label": 'Yesterday',
                        # Python 的 timestamp
                        "value": time.time() - 86400
                    },
                    {
                        "label": 'Last 7 Days',
                        "value": time.time() - 86400 * 7
                    },
                    {
                        "label": 'Last 30 Days',
                        "value": time.time() - 86400 * 30
                    }
                ])
if __name__ == "__main__":
    demo.queue().launch()
