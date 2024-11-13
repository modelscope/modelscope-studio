import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_locale = "en_US"
default_direction = 'ltr'
with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider(
                locale=default_locale,
                direction=default_direction) as config_provider:
            with ms.Div(elem_style=dict(marginBottom=16)):
                ms.Span("change locale of components:",
                        elem_style=dict(marginInlineEnd=16))
                with antd.Radio.Group(value=default_locale) as locale:
                    with antd.Radio("en_US"):
                        ms.Text("English")
                    with antd.Radio("zh_CN"):
                        ms.Text("中文")
                    with antd.Radio("jp_JP"):
                        ms.Text("日本語")
                    with antd.Radio("kr_KR"):
                        ms.Text("한국어")
                with antd.Space(wrap=True):
                    antd.DatePicker()
                    antd.DatePicker.RangePicker()
                    antd.TimePicker()
                    antd.TimePicker.RangePicker()
            with ms.Div(elem_style=dict(marginBottom=16)):
                ms.Span("change direction of components:",
                        elem_style=dict(marginInlineEnd=16))
                with antd.Radio.Group(value=default_direction) as direction:
                    with antd.Radio.Button("ltr"):
                        ms.Text("LTR")
                    with antd.Radio.Button("rtl"):
                        ms.Text("RTL")
                antd.Input(placeholder="do something...")
        locale.change(fn=lambda _locale: gr.update(locale=_locale),
                      inputs=[locale],
                      outputs=[config_provider])
        direction.change(fn=lambda _direction: gr.update(direction=_direction),
                         inputs=[direction],
                         outputs=[config_provider])

if __name__ == "__main__":
    demo.queue().launch()
