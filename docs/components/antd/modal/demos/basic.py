import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            btn = antd.Button("Open Modal", type="primary")
            with antd.Modal(open=False, title="Basic Modal") as modal:
                antd.Typography.Paragraph("Some contents...")
                antd.Typography.Paragraph("Some contents...")
                antd.Typography.Paragraph("Some contents...")
            btn.click(lambda: gr.update(open=True), outputs=[modal])

            modal.ok(lambda: gr.update(open=False), outputs=[modal])
            modal.cancel(lambda: gr.update(open=False), outputs=[modal])
if __name__ == "__main__":
    demo.queue().launch()
