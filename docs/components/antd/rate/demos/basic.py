import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.Rate(tooltips=[
                    'terrible', 'bad', 'normal', 'good', 'wonderful'
                ])
                antd.Rate(allow_half=True, allow_clear=False)
                antd.Rate(value=2, character="({ index = 0 }) => index + 1")
                antd.Rate(value=2, character="A", allow_half=True)
                with antd.Rate(value=3):
                    with ms.Slot("character"):
                        antd.Icon("SmileOutlined")
if __name__ == "__main__":
    demo.queue().launch()
