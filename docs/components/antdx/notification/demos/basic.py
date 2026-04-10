import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            notification = antdx.Notification(
                title="Hello Notification",
                body=
                "This is a browser native notification triggered from Gradio.",
                duration=5000,
                visible=False)
            btn = antd.Button("Send Notification", type="primary")

            btn.click(
                fn=lambda: gr.update(visible=True),
                outputs=[notification],
            )

if __name__ == "__main__":
    demo.queue().launch()
