import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(vertical=True, gap="small"):
                with antd.Watermark(content="Ant Design"):
                    antd.Card(elem_style=dict(height=200))
                with antd.Watermark(content=['Ant Design', 'Happy Working']):
                    antd.Card(elem_style=dict(height=200))
                with antd.Watermark(
                        height=30,
                        width=130,
                        image=
                        "https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*lkAoRbywo0oAAAAAAAAAAAAADrJ8AQ/original"
                ):
                    antd.Card(elem_style=dict(height=200))

if __name__ == "__main__":
    demo.queue().launch()
