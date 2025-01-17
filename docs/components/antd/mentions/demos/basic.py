import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.Mentions(elem_style=dict(width=320),
                              placeholder="Input @ to mention",
                              options=[{
                                  "value": "modelscope",
                                  "label": "modelscope"
                              }, {
                                  "value": "gradio",
                                  "label": "gradio"
                              }, {
                                  "value": "ant design",
                                  "label": "ant design"
                              }])
                with antd.Mentions(elem_style=dict(width=320),
                                   prefix=['@', "#"],
                                   placeholder="Input @ or # to mention"):
                    with antd.Mentions.Option(value="modelscope"):
                        with ms.Slot("label"):
                            antd.Typography.Text("modelscope", type="success")
                    with antd.Mentions.Option(value="gradio"):
                        with ms.Slot("label"):
                            antd.Typography.Text("gradio", type="success")
                    with antd.Mentions.Option(value="ant design"):
                        with ms.Slot("label"):
                            antd.Typography.Text("ant design", type="success")

if __name__ == "__main__":
    demo.queue().launch()
