import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Divider("Success")
            with antd.Result(
                    status="success",
                    title="Successfully Purchased Cloud Server ECS!",
                    sub_title=
                    "Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.",
            ):
                with ms.Slot("extra"):
                    antd.Button("Go Console", type="primary")
                    antd.Button("Buy Again")
            antd.Divider("Info")
            with antd.Result(title="Your operation has been executed", ):
                with ms.Slot("extra"):
                    antd.Button("Go Console", type="primary")
            antd.Divider("Warning")
            with antd.Result(
                    status="warning",
                    title="There are some problems with your operation.",
            ):
                with ms.Slot("extra"):
                    antd.Button("Go Console", type="primary")
            antd.Divider("Error")
            with antd.Result(
                    status="error",
                    title="Submission Failed.",
                    sub_title=
                    "Please check and modify the following information before resubmitting."
            ):
                with ms.Slot("extra"):
                    antd.Button("Go Console", type="primary")
                    antd.Button("Buy Again")
                with ms.Div():
                    with antd.Typography.Paragraph():
                        antd.Typography.Text(
                            "The content you submitted has the following error:",
                            strong=True,
                            elem_style=dict(fontSize=16))
                    with antd.Typography.Paragraph():
                        antd.Icon("CloseCircleOutlined",
                                  elem_style=dict(color="red"))
                        ms.Text("Your account has been frozen.")
                        antd.Typography.Link("Thaw immediately >")
                    with antd.Typography.Paragraph():
                        antd.Icon("CloseCircleOutlined",
                                  elem_style=dict(color="red"))
                        ms.Text("our account is not yet eligible to apply.")
                        antd.Typography.Link("TApply Unlock >")
if __name__ == "__main__":
    demo.queue().launch()
