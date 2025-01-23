import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def Content():
    antd.Typography.Paragraph("Content")
    antd.Typography.Paragraph("Content")


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                with antd.Popover(title="Title", trigger="hover"):
                    with ms.Slot("content"):
                        Content()
                    antd.Button("Hover me", type="primary")
                with antd.Popover(title="Title", trigger="focus"):
                    with ms.Slot("content"):
                        Content()
                    antd.Button("Focus me", type="primary")
                with antd.Popover(title="Title", trigger="click"):
                    with ms.Slot("content"):
                        Content()
                    antd.Button("Click me", type="primary")

if __name__ == "__main__":
    demo.queue().launch()
