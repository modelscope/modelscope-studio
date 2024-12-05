import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Pagination(total=85,
                            show_quick_jumper=True,
                            show_size_changer=True,
                            show_total="(total) => `Total ${total} items`")

if __name__ == "__main__":
    demo.queue().launch()
