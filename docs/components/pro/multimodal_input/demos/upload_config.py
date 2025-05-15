import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro
from modelscope_studio.components.pro.multimodal_input import \
  MultimodalInputUploadConfig

with gr.Blocks() as demo, ms.Application(), antdx.XProvider():
    with antd.Flex(vertical=True, gap="small"):
        antd.Divider("Style")
        pro.MultimodalInput(upload_config=MultimodalInputUploadConfig(
            upload_button_tooltip="Upload",
            title="Upload Attachments",
            placeholder={
                "inline": {
                    "title": "Upload files",
                    "description": "Click or drag files to this area to upload"
                },
                "drop": {
                    "title": "Drop files here",
                }
            }))
        antd.Divider("Upload Limits")
        pro.MultimodalInput(upload_config=MultimodalInputUploadConfig(
            accept="image/*", fullscreen_drop=True, multiple=True,
            max_count=4))
        antd.Divider("Other Sources")
        pro.MultimodalInput(upload_config=MultimodalInputUploadConfig(
            allow_speech=True, allow_paste_file=True))
        pro.MultimodalInput(mode="block",
                            auto_size=dict(minRows=2, maxRows=6),
                            upload_config=MultimodalInputUploadConfig(
                                allow_speech=True, allow_paste_file=True))

if __name__ == "__main__":
    demo.queue().launch()
