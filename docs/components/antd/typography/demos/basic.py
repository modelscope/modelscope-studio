import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_edit(e: gr.EventData):
    return gr.update(value=e._data["payload"][0])


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Typography.Title("Hello, World!", level=3)
            antd.Typography.Text("Hello, World!", disabled=True)
            antd.Typography.Text("Hello, World!", type="danger")
            antd.Typography.Paragraph('This is a copyable text.',
                                      copyable=True)
            p = antd.Typography.Paragraph('This is an editable text.')
            p.editable_change(on_edit, outputs=[p])

if __name__ == "__main__":
    demo.queue().launch()
