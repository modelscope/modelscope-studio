import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def info():
    return gr.update(
        visible=True,
        mask_closable=False,
        title="Info",
        type="info",
        content="This is a info message.",
    )


def success():
    return gr.update(
        visible=True,
        mask_closable=False,
        title="Success",
        type="success",
        content="This is a success message.",
    )


def error():
    return gr.update(
        visible=True,
        mask_closable=False,
        title="Error",
        type="error",
        content="This is an error message.",
    )


def warning():
    return gr.update(
        visible=True,
        mask_closable=False,
        title="Warning",
        type="warning",
        content="This is a warning message.",
    )


def confirm():
    return gr.update(
        visible=True,
        mask_closable=True,
        title="Confirm",
        type="confirm",
        content="This is a confirm message.",
    )


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                info_btn = antd.Button("Info")
                success_btn = antd.Button("Success")
                error_btn = antd.Button("Error")
                warning_btn = antd.Button("Warning")
                confirm_btn = antd.Button("Confirm")

            modal = antd.Modal.Static(visible=False)
            info_btn.click(info, outputs=[modal])
            success_btn.click(success, outputs=[modal])
            error_btn.click(error, outputs=[modal])
            warning_btn.click(warning, outputs=[modal])
            confirm_btn.click(confirm, outputs=[modal])
if __name__ == "__main__":
    demo.queue().launch()
