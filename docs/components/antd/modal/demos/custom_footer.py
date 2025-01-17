import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            btn = antd.Button("Open Modal", type="primary")
            with antd.Modal(open=False, title="Basic Modal") as modal:
                with ms.Slot("footer"):
                    cancel_btn = antd.Button("Return")
                    submit_btn = antd.Button("Submit", type="primary")
                    link_btn = antd.Button("Search on Google",
                                           type="primary",
                                           href_target="_blank",
                                           href="https://google.com")
                antd.Typography.Paragraph("Some contents...")
                antd.Typography.Paragraph("Some contents...")
                antd.Typography.Paragraph("Some contents...")
            btn.click(lambda: gr.update(open=True), outputs=[modal])

            modal.ok(lambda: gr.update(open=False), outputs=[modal])

            cancel_btn.click(lambda: gr.update(open=False), outputs=[modal])
            modal.cancel(lambda: gr.update(open=False), outputs=[modal])
            gr.on([submit_btn.click, link_btn.click],
                  fn=lambda: gr.update(open=False),
                  outputs=[modal])
if __name__ == "__main__":
    demo.queue().launch()
