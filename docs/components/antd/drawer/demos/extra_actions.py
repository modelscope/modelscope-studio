import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_placement = 'right'

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                placement = antd.RadioGroup(
                    options=["top", "bottom", "left", "right"],
                    value=default_placement)
                btn = antd.Button("Open Drawer", type="primary")
            with antd.Drawer(open=False,
                             title="Drawer with extra actions",
                             width=500) as drawer:
                with ms.Slot("extra"):
                    with antd.Space():
                        cancel_btn = antd.Button("Cancel")
                        ok_btn = antd.Button("OK", type="primary")
                antd.Typography.Paragraph("Some contents...")
                antd.Typography.Paragraph("Some contents...")
                antd.Typography.Paragraph("Some contents...")
            placement.change(fn=lambda p: gr.update(placement=p),
                             inputs=[placement],
                             outputs=[drawer])
            btn.click(fn=lambda: gr.update(open=True), outputs=[drawer])

            gr.on([drawer.close, ok_btn.click, cancel_btn.click],
                  fn=lambda: gr.update(open=False),
                  outputs=[drawer])

if __name__ == "__main__":
    demo.queue().launch()
