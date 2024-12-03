import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(size=16, wrap=True):
                with antd.Avatar():
                    with ms.Slot("icon"):
                        antd.Icon("UserOutlined")
                with antd.Avatar():
                    ms.Text('U')
                with antd.Avatar(shape="square"):
                    ms.Text("USER")
                antd.Avatar(
                    "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                )
                with antd.Avatar():
                    with ms.Slot("src"):
                        antd.Image(
                            "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg",
                            alt="avatar")
                with antd.Avatar(elem_style=dict(backgroundColor='#fde3cf',
                                                 color='#f56a00')):
                    ms.Text("U")
                with antd.Avatar(elem_style=dict(backgroundColor='#87d068')):
                    with ms.Slot("icon"):
                        antd.Icon("UserOutlined")

            antd.Divider("With Badge")
            with antd.Space(size=24):
                with antd.Badge(count=1):
                    with antd.Avatar(shape="square"):
                        with ms.Slot("icon"):
                            antd.Icon("UserOutlined")
                with antd.Badge(dot=True):
                    with antd.Avatar(shape="square"):
                        with ms.Slot("icon"):
                            antd.Icon("UserOutlined")
if __name__ == "__main__":
    demo.queue().launch()
