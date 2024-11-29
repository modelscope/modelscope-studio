import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="middle", align="start", vertical=True):
                ms.Div("Select justify:")
                justify_segmented = antd.Segmented('flex-start',
                                                   options=[
                                                       'flex-start',
                                                       'center',
                                                       'flex-end',
                                                       'space-between',
                                                       'space-around',
                                                       'space-evenly',
                                                   ])
                ms.Div("Select align:")
                align_segmented = antd.Segmented(
                    'flex-start', options=['flex-start', 'center', 'flex-end'])
                with antd.Flex(elem_style=dict(
                        width='100%',
                        height=120,
                        borderRadius=6,
                        border='1px solid #40a9ff',
                ),
                               justify="flex-start",
                               align="flex-start") as flex:
                    antd.Button("Primary", type="primary")
                    antd.Button("Primary", type="primary")
                    antd.Button("Primary", type="primary")
                    antd.Button("Primary", type="primary")
                justify_segmented.change(fn=lambda _justify_segmented: gr.
                                         update(justify=_justify_segmented),
                                         inputs=[justify_segmented],
                                         outputs=[flex])
                align_segmented.change(fn=lambda _align_segmented: gr.update(
                    align=_align_segmented),
                                       inputs=[align_segmented],
                                       outputs=[flex])

if __name__ == "__main__":
    demo.queue().launch()
