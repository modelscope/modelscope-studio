import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            btn = antd.Button("Open Drawer", type="primary")
            with antd.Drawer(open=False, title="Basic Drawer") as drawer:
                antd.Typography.Paragraph("Some contents...")
                antd.Typography.Paragraph("Some contents...")
                antd.Typography.Paragraph("Some contents...")
            btn.click(fn=lambda: gr.update(open=True), outputs=[drawer])

            drawer.close(fn=lambda: gr.update(open=False), outputs=[drawer])

if __name__ == "__main__":
    demo.queue().launch()
