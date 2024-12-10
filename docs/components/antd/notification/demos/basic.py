import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def info():
    return gr.update(visible=True,
                     type="info",
                     message="Info Notification Message",
                     description="This is a info description.",
                     placement="topLeft",
                     key="info")


def success():
    return gr.update(visible=True,
                     type="success",
                     message="Success Notification Message",
                     description="This is a success description.",
                     placement="topRight",
                     key="success")


def error():
    return gr.update(visible=True,
                     type="error",
                     message="Error Notification Message",
                     description="This is an error description.",
                     placement="bottomLeft",
                     key="error")


def warning():
    return gr.update(visible=True,
                     type="warning",
                     message="Warning Notification Message",
                     description="This is a warning description.",
                     placement="bottomRight",
                     key="warning")


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                info_btn = antd.Button("Info")
                success_btn = antd.Button("Success")
                error_btn = antd.Button("Error")
                warning_btn = antd.Button("Warning")

            notification = antd.Notification(visible=False)
            info_btn.click(info, outputs=[notification])
            success_btn.click(success, outputs=[notification])
            error_btn.click(error, outputs=[notification])
            warning_btn.click(warning, outputs=[notification])

if __name__ == "__main__":
    demo.queue().launch()
