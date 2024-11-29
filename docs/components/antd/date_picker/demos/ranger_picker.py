import time

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.DatePicker.RangePicker()
                antd.DatePicker.RangePicker(show_time=True)
                antd.DatePicker.RangePicker(picker="week")
                antd.DatePicker.RangePicker(picker="month")
                antd.DatePicker.RangePicker(picker="quarter")
                antd.DatePicker.RangePicker(picker="year")
if __name__ == "__main__":
    demo.queue().launch()
