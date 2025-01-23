import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                with antd.Tooltip(title="prompt text"):
                    ms.Span("Tooltip will show on mouse enter.")
                with antd.Tooltip():
                    with ms.Slot("title"):
                        antd.Typography.Text("prompt text", type="success")
                    ms.Span("Custom Title")
if __name__ == "__main__":
    demo.queue().launch()
