import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="middle", vertical=True):
                with antd.Radio.Group("horizontal") as radio_group:
                    with antd.Radio("horizontal"):
                        ms.Text("horizontal")
                    with antd.Radio("vertical"):
                        ms.Text("vertical")
                with antd.Flex(vertical=False) as flex:
                    for i in range(4):
                        ms.Div(elem_style=dict(height=54,
                                               width="25%",
                                               backgroundColor='#1677ff' if i %
                                               2 else '#1677ffbf'))
                radio_group.change(fn=lambda _radio_group: gr.update(
                    vertical=True if _radio_group == "vertical" else False),
                                   inputs=[radio_group],
                                   outputs=[flex])
if __name__ == "__main__":
    demo.queue().launch()
