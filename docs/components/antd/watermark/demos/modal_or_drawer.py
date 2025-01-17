import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="middle"):
                btn = antd.Button("Open Modal", type="primary")
                btn2 = antd.Button("Open Drawer", type="primary")
            with antd.Watermark(content="Ant Design"):
                with antd.Modal(open=False, title="Basic Modal") as modal:
                    antd.Typography.Paragraph("Some contents...")
                    antd.Typography.Paragraph("Some contents...")
                    antd.Typography.Paragraph("Some contents...")

                modal.ok(lambda: gr.update(open=False), outputs=[modal])
                modal.cancel(lambda: gr.update(open=False), outputs=[modal])
            with antd.Watermark(content="Ant Design"):
                with antd.Drawer(open=False, title="Basic Drawer") as drawer:
                    antd.Typography.Paragraph("Some contents...")
                    antd.Typography.Paragraph("Some contents...")
                    antd.Typography.Paragraph("Some contents...")
                drawer.close(lambda: gr.update(open=False), outputs=[drawer])
            btn.click(lambda: gr.update(open=True), outputs=[modal])
            btn2.click(lambda: gr.update(open=True), outputs=[drawer])

if __name__ == "__main__":
    demo.queue().launch()
