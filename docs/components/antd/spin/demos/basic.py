import time

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def show_loading():
    yield gr.update(spinning=True)
    time.sleep(2)
    yield gr.update(spinning=False)


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(align="center", gap="middle"):
                antd.Spin(size="small")
                antd.Spin()
                antd.Spin(size="large")
            antd.Divider("Custom spinning indicator")
            with antd.Flex(align="center", gap="middle"):
                with antd.Spin(size="small"):
                    with ms.Slot("indicator"):
                        antd.Icon("LoadingOutlined", spin=True)
                with antd.Spin():
                    with ms.Slot("indicator"):
                        antd.Icon("LoadingOutlined", spin=True)
                with antd.Spin(size="large"):
                    with ms.Slot("indicator"):
                        antd.Icon("LoadingOutlined", spin=True)
            antd.Divider("Progress")
            with antd.Flex(align="center", gap="middle"):
                antd.Spin(percent=50, size="small")
                antd.Spin(percent=90)
                antd.Spin(percent="auto", size="large")
            antd.Divider("Embedded mode")
            with antd.Space(direction='vertical'):
                with antd.Spin(tip="Loading...", spinning=False) as spin1:
                    antd.Alert(
                        message="Alert message title",
                        description=
                        "Further details about the context of this alert.",
                        type="info")
                antd.Button("Show loading").click(fn=show_loading,
                                                  outputs=[spin1])
            antd.Divider("Fullscreen")
            spin2 = antd.Spin(spinning=False, fullscreen=True)
            antd.Button("Show fullscreen").click(fn=show_loading,
                                                 outputs=[spin2])

if __name__ == "__main__":
    demo.queue().launch()
