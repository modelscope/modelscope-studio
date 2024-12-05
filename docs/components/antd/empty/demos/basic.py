import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_bordered = False

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.Empty()
                antd.Empty(description=False)
                antd.Empty(image="PRESENTED_IMAGE_SIMPLE")
                with antd.Empty(
                        image=
                        "https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg",
                        image_style=dict(height=60)):
                    with ms.Slot("description"):
                        with antd.Typography.Text():
                            ms.Text("Customize")
                            antd.Button('Description', type="link", href="#")
                    antd.Button("Create Now", type="primary")
if __name__ == "__main__":
    demo.queue().launch()
