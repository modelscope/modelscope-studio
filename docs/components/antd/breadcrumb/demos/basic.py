import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Breadcrumb():
                antd.Breadcrumb.Item(title="Ant Design")
                with antd.Breadcrumb.Item():
                    with ms.Slot("title"):
                        antd.Button("Link", type="link", href="#")
                with antd.Breadcrumb.Item():
                    with ms.Slot("title"):
                        antd.Button("General", type="link", href="#")
                    with ms.Slot("menu.items"):
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
                antd.Breadcrumb.Item(title="Button")

if __name__ == "__main__":
    demo.queue().launch()
