import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical", size=16):
                with antd.Card(hoverable=True, elem_style=dict(width=240)):
                    with ms.Slot("cover"):
                        antd.Image(
                            value=
                            "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
                            width="100%",
                            preview=False,
                            alt="example")
                    antd.Card.Meta(title="Europe Street beat",
                                   description="www.instagram.com")
                with antd.Card(elem_style=dict(width=300)):
                    with ms.Slot("cover"):
                        antd.Image(
                            value=
                            "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
                            preview=False,
                            width="100%",
                            alt="example")
                    with ms.Slot("actions"):
                        antd.Icon("SettingOutlined")
                        antd.Icon("EditOutlined")
                        antd.Icon("EllipsisOutlined")
                    with antd.Card.Meta(title="Card title",
                                        description="This is the description"):
                        with ms.Slot("avatar"):
                            antd.Avatar(
                                "https://api.dicebear.com/7.x/miniavs/svg?seed=8"
                            )

if __name__ == "__main__":
    demo.queue().launch()
