import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.QRCode("https://ant.design")
            antd.Divider("With Icon")
            antd.QRCode(
                value="https://ant.design/",
                error_level='H',
                icon=
                "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            )

if __name__ == "__main__":
    demo.queue().launch()
