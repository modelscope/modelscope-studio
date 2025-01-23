import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Input(show_count=dict(formatter="""({ count }) => {
                  return `${count} characters`;
              }"""))

if __name__ == "__main__":
    demo.queue().launch()
