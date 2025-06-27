import gradio as gr
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():  # or antd.ConfigProvider
            with ms.AutoLoading():
                antdx.Welcome(
                    icon=
                    "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",
                    title="Hello, I'm Ant Design X",
                    description=
                    "Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
                )

if __name__ == "__main__":
    demo.queue().launch()
