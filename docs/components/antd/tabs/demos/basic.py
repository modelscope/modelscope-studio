import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Tabs(default_active_key='1'):
                with antd.Tabs.Item(key="1", label="Tab1"):
                    ms.Text("Tab 1")
                with antd.Tabs.Item(key="2", label="Tab2", disabled=True):
                    ms.Text("Tab 2")
                with antd.Tabs.Item(key="3", label="Tab3"):
                    ms.Text("Tab 3")
                    with ms.Slot("icon"):
                        antd.Icon("AndroidOutlined")
            antd.Divider("Extra content")
            with antd.Tabs(default_active_key='1'):
                with ms.Slot("tabBarExtraContent.left"):
                    antd.Button("Left Extra Action")
                with ms.Slot("tabBarExtraContent.right"):
                    antd.Button("Right Extra Action")
                with antd.Tabs.Item(key="1", label="Tab1"):
                    ms.Text("Tab 1")
                with antd.Tabs.Item(key="2", label="Tab2"):
                    ms.Text("Tab 2")
                with antd.Tabs.Item(key="3", label="Tab3"):
                    ms.Text("Tab 3")

if __name__ == "__main__":
    demo.queue().launch()
