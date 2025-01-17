import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_change(e: gr.EventData):
    print(e._data["payload"])


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            rate = antd.Rate()
            rate.change(on_change)

if __name__ == "__main__":
    demo.queue().launch()
