import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                antd.Switch(value=True)
                antd.Switch(checked_children="Open",
                            un_checked_children="Close")
                with antd.Switch(value=True):
                    with ms.Slot("checkedChildren"):
                        antd.Icon("CheckOutlined")
                    with ms.Slot("unCheckedChildren"):
                        antd.Icon("CloseOutlined")

if __name__ == "__main__":
    demo.queue().launch()
