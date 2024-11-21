import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def Title(title: str):
    with antd.Flex(align="center", justify="space-between"):
        ms.Span(title)

        antd.Button("more",
                    type="link",
                    href="https://www.google.com/search?q=antd",
                    href_target="_blank")


def AutoCompleteSubOption(title: str, count: int):
    with antd.AutoComplete.Option(value=title):
        with ms.Slot("label"):
            with antd.Flex(align="center", justify="space-between"):
                ms.Text(title)
                with ms.Span():
                    antd.Icon("UserOutlined")
                    ms.Text(count)


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.AutoComplete(elem_style=dict(width=250),
                                   size="large",
                                   popup_match_select_width=500):
                with ms.Slot("children"):
                    antd.Input.Search(size="large",
                                      placeholder="Typing here...")
                with ms.Slot("options"):
                    with antd.AutoComplete.Option():
                        with ms.Slot("label"):
                            Title("Libraries")
                        with ms.Slot("options"):
                            AutoCompleteSubOption("Ant Design", 10000)
                            AutoCompleteSubOption('AntDesign UI', 10600)
                    with antd.AutoComplete.Option():
                        with ms.Slot("label"):
                            Title("Solutions")
                        with ms.Slot("options"):
                            AutoCompleteSubOption('AntDesign UI FAQ', 60100)
                            AutoCompleteSubOption('AntDesign FAQ', 30010)
                    with antd.AutoComplete.Option():
                        with ms.Slot("label"):
                            Title("Articles")
                        with ms.Slot("options"):
                            AutoCompleteSubOption('AntDesign design language',
                                                  100000)

if __name__ == "__main__":
    demo.queue().launch()
