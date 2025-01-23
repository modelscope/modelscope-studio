import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            ms.Markdown("`Hello Markdown`", show_copy_button=True)
            antd.Divider()
            with ms.Markdown("`Hello Markdown`", show_copy_button=True):
                with ms.Slot("copyButtons"):
                    with antd.Button(value=None, size="small"):
                        with ms.Slot("icon"):
                            antd.Icon("CopyOutlined")
                    with antd.Button(value=None, size="small"):
                        with ms.Slot("icon"):
                            antd.Icon("CheckOutlined")

if __name__ == "__main__":
    demo.queue().launch()
