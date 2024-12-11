import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="middle", vertical=True):
                antd.Skeleton()
                antd.Skeleton(avatar=True, paragraph=dict(rows=4))
                antd.Skeleton(active=True)
            antd.Divider("Button/Avatar/Input/Image/Node")
            with antd.Flex(vertical=True, gap="small"):
                with antd.Space():
                    antd.Skeleton.Button()
                    antd.Skeleton.Avatar()
                    antd.Skeleton.Input()
                antd.Skeleton.Button(block=True)
                antd.Skeleton.Input(block=True)
                with antd.Space():
                    antd.Skeleton.Image()
                    antd.Skeleton.Node(elem_style=dict(width=160))
                    with antd.Skeleton.Node():
                        antd.Icon("DotChartOutlined",
                                  elem_style=dict(font_size=40,
                                                  color="#bfbfbf"))
if __name__ == "__main__":
    demo.queue().launch()
