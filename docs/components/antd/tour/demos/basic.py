import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            btn = antd.Button("Begin Tour",
                              type="primary",
                              elem_id="tour-begin-btn")
            with antd.Tour(open=False) as tour:
                antd.Tour.Step(
                    title="Center",
                    description="Displayed in the center of screen.",
                    get_target=None)
                antd.Tour.Step(
                    title="Right",
                    description="On the right of target.",
                    get_target=
                    "() => document.querySelector('#tour-begin-btn')",
                    placement="right")
                with antd.Tour.Step(
                        title="Top",
                        get_target=
                        "() => document.querySelector('#tour-begin-btn')",
                        placement="top"):
                    with ms.Slot("description"):
                        antd.Typography.Text("On the top of target.",
                                             type="success")

            btn.click(lambda: gr.update(open=True), outputs=[tour])
            gr.on([tour.close, tour.finish],
                  lambda: gr.update(open=False),
                  outputs=[tour])

if __name__ == "__main__":
    demo.queue().launch()
