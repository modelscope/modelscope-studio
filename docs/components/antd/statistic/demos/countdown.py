import time

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Row(gutter=20):
                with antd.Col(span=12):
                    antd.Statistic.Countdown(
                        value=lambda: time.time() + 60 * 60 * 24 * 2,
                        title="Countdown")
                with antd.Col(span=12):
                    antd.Statistic.Countdown(
                        value=lambda: time.time() + 60 * 60 * 24 * 2,
                        title="Million Seconds",
                        format="HH:mm:ss:SSS")
                with antd.Col(span=12):
                    antd.Statistic.Countdown(
                        value=lambda: time.time() + 60 * 60 * 24 * 2,
                        title="Day Level",
                        format="D-H-m-s")
if __name__ == "__main__":
    demo.queue().launch()
