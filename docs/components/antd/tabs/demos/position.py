import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_position = "top"

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                ms.Text("Tab position")
                position = antd.Radio.Group(
                    value=default_position,
                    option_type="button",
                    options=["top", "left", "right", "bottom"])
            with antd.Tabs(default_active_key='1') as tabs:
                with antd.Tabs.Item(key="1", label="Tab1"):
                    ms.Text("Tab 1")
                with antd.Tabs.Item(key="2", label="Tab2"):
                    ms.Text("Tab 2")
                with antd.Tabs.Item(key="3", label="Tab3"):
                    ms.Text("Tab 3")
            position.change(fn=lambda x: gr.update(tab_position=x),
                            inputs=[position],
                            outputs=[tabs])

if __name__ == "__main__":
    demo.queue().launch()
