import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Avatar.Group():
                antd.Avatar(
                    value="https://api.dicebear.com/7.x/miniavs/svg?seed=1")
                with antd.Avatar(elem_style=dict(backgroundColor="#f56a00")):
                    ms.Text("K")
                with antd.Tooltip(title="Ant User", placement="top"):
                    with antd.Avatar(elem_style=dict(
                            backgroundColor="#87d068")):
                        with ms.Slot("icon"):
                            antd.Icon("UserOutlined")
                with antd.Avatar(elem_style=dict(backgroundColor="#1677ff")):
                    with ms.Slot("icon"):
                        antd.Icon("AntDesignOutlined")

            antd.Divider()

            with antd.Avatar.Group(max=dict(
                    count=2,
                    style=dict(color="#f56a00", backgroundColor="#fde3cf"))):
                antd.Avatar(
                    value="https://api.dicebear.com/7.x/miniavs/svg?seed=2")
                with antd.Avatar(elem_style=dict(backgroundColor="#f56a00")):
                    ms.Text("K")
                with antd.Tooltip(title="Ant User", placement="top"):
                    with antd.Avatar(elem_style=dict(
                            backgroundColor="#87d068")):
                        with ms.Slot("icon"):
                            antd.Icon("UserOutlined")
                with antd.Avatar(elem_style=dict(backgroundColor="#1677ff")):
                    with ms.Slot("icon"):
                        antd.Icon("AntDesignOutlined")

            antd.Divider()

            with antd.Avatar.Group(size="large",
                                   max=dict(count=2,
                                            style=dict(
                                                color="#f56a00",
                                                backgroundColor="#fde3cf"))):
                antd.Avatar(
                    value="https://api.dicebear.com/7.x/miniavs/svg?seed=3")
                with antd.Avatar(elem_style=dict(backgroundColor="#f56a00")):
                    ms.Text("K")
                with antd.Tooltip(title="Ant User", placement="top"):
                    with antd.Avatar(elem_style=dict(
                            backgroundColor="#87d068")):
                        with ms.Slot("icon"):
                            antd.Icon("UserOutlined")
                with antd.Avatar(elem_style=dict(backgroundColor="#1677ff")):
                    with ms.Slot("icon"):
                        antd.Icon("AntDesignOutlined")

            antd.Divider()

            with antd.Avatar.Group(size="large",
                                   max=dict(count=2,
                                            style=dict(
                                                color="#f56a00",
                                                backgroundColor="#fde3cf",
                                                cursor="pointer"),
                                            popover=dict(trigger="click"))):
                antd.Avatar(
                    value=
                    "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                )
                with antd.Avatar(elem_style=dict(backgroundColor="#f56a00")):
                    ms.Text("K")
                with antd.Tooltip(title="Ant User", placement="top"):
                    with antd.Avatar(elem_style=dict(
                            backgroundColor="#87d068")):
                        with ms.Slot("icon"):
                            antd.Icon("UserOutlined")
                with antd.Avatar(elem_style=dict(backgroundColor="#1677ff")):
                    with ms.Slot("icon"):
                        antd.Icon("AntDesignOutlined")

            antd.Divider()

            with antd.Avatar.Group(shape="square"):
                with antd.Avatar(elem_style=dict(backgroundColor="#fde3cf")):
                    ms.Text("A")
                with antd.Avatar(elem_style=dict(backgroundColor="#f56a00")):
                    ms.Text("K")
                with antd.Avatar(elem_style=dict(backgroundColor="#87d068")):
                    with ms.Slot("icon"):
                        antd.Icon("UserOutlined")
                with antd.Avatar(elem_style=dict(backgroundColor="#1677ff")):
                    with ms.Slot("icon"):
                        antd.Icon("AntDesignOutlined")
if __name__ == "__main__":
    demo.queue().launch()
