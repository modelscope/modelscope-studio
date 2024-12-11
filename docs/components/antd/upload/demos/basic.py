import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Upload(multiple=True) as upload:
                with antd.Button():
                    ms.Text("Click to Upload")
                    with ms.Slot("icon"):
                        antd.Icon("UploadOutlined")
            upload.change(fn=lambda _upload: print(_upload), inputs=[upload])
            antd.Divider("Pictures with list style")
            with antd.Upload(multiple=True,
                             max_count=3,
                             list_type="picture",
                             accept="image/*"):
                with antd.Button(type="primary"):
                    ms.Text("Upload (Max: 3)")
                    with ms.Slot("icon"):
                        antd.Icon("UploadOutlined")
            antd.Divider("Drag and Drop")
            with antd.Upload.Dragger(multiple=True):
                with ms.Div(elem_style=dict(fontSize=40, color="#1677ff")):
                    antd.Icon("InboxOutlined")
                antd.Typography.Paragraph(
                    "Click or drag file to this area to upload")
                antd.Typography.Paragraph(
                    "Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.",
                    type="secondary")

if __name__ == "__main__":
    demo.queue().launch()
