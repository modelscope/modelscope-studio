import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def Desc(text: str):
    with antd.Flex(justify="center"):
        with antd.Typography.Title(type="secondary",
                                   level=5,
                                   elem_style=dict(whiteSpace="nowrap")):
            ms.Text(text)


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Splitter(elem_style=dict(
                    height=500, boxShadow='0 0 10px rgba(0, 0, 0, 0.1)')):
                with antd.Splitter.Panel(collapsible=True):
                    Desc("Left")
                with antd.Splitter.Panel(collapsible=True):
                    with antd.Splitter(layout="vertical"):
                        with antd.Splitter.Panel():
                            Desc("Top")
                        with antd.Splitter.Panel():
                            Desc("Bottom")

if __name__ == "__main__":
    demo.queue().launch()
