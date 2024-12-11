import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_dot_position = 'bottom'
default_auto_play = True
default_show_arrows = True

content_style = {
    "margin": 0,
    "height": '160px',
    "color": '#fff',
    "lineHeight": '160px',
    "textAlign": 'center',
    "background": '#364d79',
}

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                dot_position = antd.RadioGroup(value=default_dot_position,
                                               option_type="button",
                                               options=[{
                                                   "label": "Top",
                                                   "value": "top"
                                               }, {
                                                   "label": "Bottom",
                                                   "value": "bottom"
                                               }, {
                                                   "label": "Left",
                                                   "value": "left"
                                               }, {
                                                   "label": "Right",
                                                   "value": "right"
                                               }])
                auto_play = antd.Switch(value=default_auto_play,
                                        checked_children="AutoPlay",
                                        un_checked_children="No AutoPlay")
                show_arrows = antd.Switch(value=default_show_arrows,
                                          checked_children="Show Arrows",
                                          un_checked_children="Hide Arrows")
            with antd.Carousel(dot_position=default_dot_position,
                               autoplay=default_auto_play,
                               arrows=default_show_arrows) as carousel:
                with ms.Div():
                    antd.Typography.Title("1",
                                          level=3,
                                          elem_style=content_style)
                with ms.Div():
                    antd.Typography.Title("2",
                                          level=3,
                                          elem_style=content_style)
                with ms.Div():
                    antd.Typography.Title("3",
                                          level=3,
                                          elem_style=content_style)
                with ms.Div():
                    antd.Typography.Title("4",
                                          level=3,
                                          elem_style=content_style)

            auto_play.change(fn=lambda x: gr.update(autoplay=x),
                             inputs=[auto_play],
                             outputs=[carousel])
            show_arrows.change(fn=lambda x: gr.update(arrows=x),
                               inputs=[show_arrows],
                               outputs=[carousel])
            dot_position.change(fn=lambda x: gr.update(dot_position=x),
                                inputs=[dot_position],
                                outputs=[carousel])
if __name__ == "__main__":
    demo.queue().launch()
