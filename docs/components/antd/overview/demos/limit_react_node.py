import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Card():
                ms.Div("Card Content")
                ms.Div("Card Content")
                ms.Div("Card Content")
                # slots
                with ms.Slot("title"):
                    ms.Text("Card Title")
                with ms.Slot("extra"):
                    with antd.Button():
                        ms.Text("GitHub")
                        with ms.Slot("icon"):
                            antd.Icon("GithubOutlined")
if __name__ == "__main__":
    demo.queue().launch()
