import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def info():
    return gr.update(visible=True,
                     type="info",
                     content="This is a info message.",
                     key="info")


def success():
    return gr.update(visible=True,
                     type="success",
                     content="This is a success message.",
                     key="success")


def error():
    return gr.update(visible=True,
                     type="error",
                     content="This is an error message.",
                     key="error")


def warning():
    return gr.update(visible=True,
                     type="warning",
                     content="This is a warning message.",
                     key="warning")


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                info_btn = antd.Button("Info")
                success_btn = antd.Button("Success")
                error_btn = antd.Button("Error")
                warning_btn = antd.Button("Warning")

            message = antd.Message(visible=False)
            info_btn.click(info, outputs=[message])
            success_btn.click(success, outputs=[message])
            error_btn.click(error, outputs=[message])
            warning_btn.click(warning, outputs=[message])

if __name__ == "__main__":
    demo.queue().launch()
