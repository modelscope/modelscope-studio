import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def Menu():
    with antd.Menu.Item(key="1"):
        with ms.Slot("label"):
            antd.Button(
                "General",
                type="link",
                href="https://modelscope.cn",
                href_target="_blank",
            )
    with antd.Menu.Item(key="2"):
        with ms.Slot("label"):
            antd.Button(
                "Layout",
                type="link",
                href="https://ant.design/",
                href_target="_blank",
            )
    with antd.Menu.Item(key="3"):
        with ms.Slot("label"):
            antd.Button(
                "Navigation",
                type="link",
                href="https://www.alipay.com/",
                href_target="_blank",
            )


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                with antd.Dropdown():
                    with antd.Button(type="text"):
                        with antd.Space():
                            ms.Text("Hover me")
                            antd.Icon("DownOutlined")
                    with ms.Slot("menu.items"):
                        Menu()
                with antd.Dropdown.Button(danger=True):
                    ms.Text("Danger")
                    with ms.Slot("menu.items"):
                        Menu()

if __name__ == "__main__":
    demo.queue().launch()
