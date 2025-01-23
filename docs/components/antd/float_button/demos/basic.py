import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.FloatButton.Group(shape="circle",
                                        elem_style=dict(insetInlineEnd=24)):
                with antd.FloatButton(badge=dict(count=12)):
                    antd.Icon("QuestionCircleOutlined")
                antd.FloatButton(badge=dict(count=123, overflowCount=999))
                antd.FloatButton.BackTop(visibility_height=0)

            antd.FloatButton(type="primary",
                             elem_style=dict(insetInlineEnd=24 + 70))

            with antd.FloatButton(elem_style=dict(insetInlineEnd=24 + 70 +
                                                  70)):
                with ms.Slot("icon"):
                    antd.Icon("QuestionCircleOutlined")
            with antd.FloatButton(type="primary",
                                  description="Tooltip",
                                  elem_style=dict(insetInlineEnd=24 + 140 +
                                                  70)):
                with ms.Slot("tooltip"):
                    ms.Div("Documents")
if __name__ == "__main__":
    demo.queue().launch()
