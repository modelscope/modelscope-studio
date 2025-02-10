import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Typography.Paragraph(
                "Set the style variant of the bubble through the variant property."
            )
            with antd.Flex(vertical=True, gap="middle"):
                with antdx.Bubble(variant="filled", content="variant: filled"):
                    with ms.Slot("avatar.icon"):
                        antd.Icon("UserOutlined")
                with antdx.Bubble(variant="outlined",
                                  content="variant: outlined"):
                    with ms.Slot("avatar.icon"):
                        antd.Icon("UserOutlined")
                with antdx.Bubble(variant="shadow", content="variant: shadow"):
                    with ms.Slot("avatar.icon"):
                        antd.Icon("UserOutlined")
                with antdx.Bubble(variant="borderless"):
                    with ms.Slot("avatar.icon"):
                        antd.Icon("UserOutlined")
                    with ms.Slot("content"):
                        with antdx.Prompts(
                                vertical=True,
                                title="variant: borderless to customize"):
                            with antdx.Prompts.Item(
                                    key='1',
                                    description=
                                    'How to rest effectively after long hours of work?'
                            ):
                                with ms.Slot("icon"):
                                    antd.Icon("CoffeeOutlined",
                                              elem_style={"color": '#964B00'})
                            with antdx.Prompts.Item(
                                    key='2',
                                    description=
                                    'What are the secrets to maintaining a positive mindset?',
                            ):
                                with ms.Slot("icon"):
                                    antd.Icon("SmileOutlined",
                                              elem_style={"color": '#FAAD14'})
                            with antdx.Prompts.Item(
                                    key='3',
                                    description=
                                    'How to stay calm under immense pressure?',
                            ):
                                with ms.Slot("icon"):
                                    antd.Icon("FireOutlined",
                                              elem_style={"color": '#FF4D4F'})

if __name__ == "__main__":
    demo.queue().launch()
