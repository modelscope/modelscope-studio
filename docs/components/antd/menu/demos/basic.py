import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_mode = 'horizontal'

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            mode_select = antd.Select(value=default_mode,
                                      options=[{
                                          "label": "horizontal",
                                          "value": "horizontal"
                                      }, {
                                          "label": "inline",
                                          "value": "inline"
                                      }, {
                                          "label": "vertical",
                                          "value": "vertical"
                                      }],
                                      elem_style=dict(width=200))
            inline_collapsed_switch = antd.Switch(
                False,
                checked_children="Inline Collapsed",
                un_checked_children="Inline Expanded")
            with antd.Menu(selected_keys=[default_mode],
                           mode="horizontal") as menu:
                with antd.Menu.Item(key="mail", label="Navigation One"):
                    with ms.Slot("icon"):
                        antd.Icon("MailOutlined")
                with antd.Menu.Item(key="app",
                                    label="Navigation Two",
                                    disabled=True):
                    with ms.Slot("icon"):
                        antd.Icon("AppstoreOutlined")
                with antd.Menu.Item(key="SubMenu",
                                    label="Navigation Three - Submenu"):
                    with ms.Slot("icon"):
                        antd.Icon("SettingOutlined")
                    with antd.Menu.Item(type="group", label="Item 1"):
                        antd.Menu.Item(label="Option 1", key="setting:1")
                        antd.Menu.Item(label="Option 2", key="setting:2")
                    with antd.Menu.Item(type="group", label="Item 2"):
                        antd.Menu.Item(label="Option 3", key="setting:3")
                        antd.Menu.Item(label="Option 4", key="setting:4")
                with antd.Menu.Item(key="modelscope",
                                    label="Navigation Four - Link"):
                    with ms.Slot("label"):
                        antd.Button("Navigation Four - Link",
                                    type="link",
                                    href="https://modelscope.cn",
                                    href_target="_blank")
            mode_select.change(
                fn=lambda _mode_select: gr.update(mode=_mode_select),
                inputs=[mode_select],
                outputs=[menu])
            inline_collapsed_switch.change(
                fn=lambda _inline_collapsed_switch: gr.update(
                    inline_collapsed=_inline_collapsed_switch),
                inputs=[inline_collapsed_switch],
                outputs=[menu])
if __name__ == "__main__":
    demo.queue().launch()
