import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_locale = "en_US"
default_direction = 'ltr'
default_color = "#816DF8"
with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider(
                locale=default_locale,
                direction=default_direction,
                theme=dict(token=dict(
                    colorPrimary=default_color))) as config_provider:
            with antd.Card():
                with ms.Div(elem_style=dict(marginBottom=16)):
                    ms.Span("change locale of components:",
                            elem_style=dict(marginInlineEnd=16))
                    with antd.Radio.Group(value=default_locale) as locale:
                        with antd.Radio("en_US"):
                            ms.Text("English")
                        with antd.Radio("zh_CN"):
                            ms.Text("中文")
                        with antd.Radio("ja_JP"):
                            ms.Text("日本語")
                        with antd.Radio("ko_KR"):
                            ms.Text("한국어")
                    with antd.Space(wrap=True):
                        antd.DatePicker()
                        antd.DatePicker.RangePicker()
                        antd.TimePicker()
                        antd.TimePicker.RangePicker()
                with ms.Div(elem_style=dict(marginBottom=16)):
                    ms.Span("change direction of components:",
                            elem_style=dict(marginInlineEnd=16))
                    with antd.Radio.Group(
                            value=default_direction) as direction:
                        with antd.Radio.Button("ltr"):
                            ms.Text("LTR")
                        with antd.Radio.Button("rtl"):
                            ms.Text("RTL")
                    antd.Input(placeholder="do something...")
                with ms.Div(elem_style=dict(marginBottom=16)):
                    ms.Span("change theme of components:",
                            elem_style=dict(marginInlineEnd=16))
                    with antd.Space():
                        with antd.Checkbox.Group() as theme:
                            antd.Checkbox.Group.Option("dark", label="dark")
                            antd.Checkbox.Group.Option("compact",
                                                       label="compact")
                        ms.Text("Primary Color: ")
                        color = antd.ColorPicker(value=default_color)

                    antd.Button("Primary Button", type="primary", block=True)

        locale.change(fn=lambda _locale: gr.update(locale=_locale),
                      inputs=[locale],
                      outputs=[config_provider])
        direction.change(fn=lambda _direction: gr.update(direction=_direction),
                         inputs=[direction],
                         outputs=[config_provider])
        gr.on(
            [theme.change, color.change],
            fn=lambda _theme, _color: gr.update(theme=dict(
                token=dict(colorPrimary=_color) if _color else None,
                algorithm=dict(dark=True
                               if _theme and 'dark' in _theme else False,
                               compact=True
                               if _theme and 'compact' in _theme else False))),
            inputs=[theme, color],
            outputs=[config_provider])

if __name__ == "__main__":
    demo.queue().launch()
